import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, hasClass } from '../util';

interface TabOptions extends ComponentOptions {
  activeTab?: string | null;
  keyboard?: boolean;
  onShow?: (tabId: string) => void;
  onShown?: (tabId: string) => void;
  onHide?: (tabId: string) => void;
  onHidden?: (tabId: string) => void;
}

interface TabItem {
  trigger: HTMLElement;
  content: HTMLElement;
  id: string;
}

export default class Tab extends BaseComponent {
  protected declare options: TabOptions;
  private tabs: TabItem[] = [];
  private activeTab: TabItem | null = null;
  private boundHandleKeydown = ((e: Event) => {
    if (e instanceof KeyboardEvent) {
      this.handleKeydown(e);
    }
  }) as EventListener;

  protected getDefaultOptions(): TabOptions {
    return {
      ...super.getDefaultOptions(),
      activeTab: null,
      keyboard: true,
      onShow: () => {},
      onShown: () => {},
      onHide: () => {},
      onHidden: () => {}
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;

    addClass(this.element, 'cl-tabs');
    
    // Find all tab triggers and content
    this.initializeTabs();
    
    if (this.tabs.length > 0) {
      // Set initial active tab
      const initialTab = this.options.activeTab 
        ? this.tabs.find(tab => tab.id === this.options.activeTab)
        : this.tabs[0];
        
      if (initialTab) {
        this.activate(initialTab.id);
      }
    }

    this.bindEvents();
  }

  private initializeTabs(): void {
    if (!(this.element instanceof HTMLElement)) return;

    // Find all tab triggers
    const triggers = this.element.querySelectorAll('[data-toggle="tab"]');
    
    triggers.forEach((trigger) => {
      if (!(trigger instanceof HTMLElement)) return;

      const targetId = trigger.getAttribute('href')?.substring(1) || 
                      trigger.getAttribute('data-target')?.substring(1);
                      
      if (!targetId) return;

      const content = document.getElementById(targetId);
      if (!content) return;

      // Setup ARIA attributes
      trigger.setAttribute('role', 'tab');
      trigger.setAttribute('aria-controls', targetId);
      content.setAttribute('role', 'tabpanel');
      content.setAttribute('aria-labelledby', trigger.id || `tab-${targetId}`);

      if (!trigger.id) {
        trigger.id = `tab-${targetId}`;
      }

      // Add to tabs collection
      this.tabs.push({
        trigger,
        content,
        id: targetId
      });

      // Initially hide all content
      content.style.display = 'none';
    });

    // Create tab list role
    const tabList = this.element.querySelector('.cl-tabs-list');
    if (tabList) {
      tabList.setAttribute('role', 'tablist');
    }
  }

  private bindEvents(): void {
    // Click events
    this.tabs.forEach(tab => {
      tab.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.activate(tab.id);
      });
    });

    // Keyboard navigation
    if (this.options.keyboard) {
      this.element.addEventListener('keydown', this.boundHandleKeydown);
    }
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.activeTab) return;

    const currentIndex = this.tabs.findIndex(tab => tab.id === this.activeTab?.id);
    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
        event.preventDefault();
        nextIndex = currentIndex + 1;
        if (nextIndex >= this.tabs.length) nextIndex = 0;
        this.activate(this.tabs[nextIndex].id);
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        event.preventDefault();
        nextIndex = currentIndex - 1;
        if (nextIndex < 0) nextIndex = this.tabs.length - 1;
        this.activate(this.tabs[nextIndex].id);
        break;

      case 'Home':
        event.preventDefault();
        this.activate(this.tabs[0].id);
        break;

      case 'End':
        event.preventDefault();
        this.activate(this.tabs[this.tabs.length - 1].id);
        break;
    }
  }

  private async deactivateCurrentTab(): Promise<void> {
    if (!this.activeTab) return;

    const { trigger, content, id } = this.activeTab;

    this.options.onHide?.(id);

    // Update ARIA attributes and classes
    trigger.setAttribute('aria-selected', 'false');
    trigger.tabIndex = -1;
    removeClass(trigger, 'active');

    // Hide content
    content.style.display = 'none';
    
    this.options.onHidden?.(id);
    this.activeTab = null;
  }

  public async activate(tabId: string): Promise<void> {
    const tab = this.tabs.find(t => t.id === tabId);
    if (!tab || tab === this.activeTab) return;

    // Deactivate current tab
    await this.deactivateCurrentTab();

    const { trigger, content, id } = tab;
    this.options.onShow?.(id);

    // Update ARIA attributes and classes
    trigger.setAttribute('aria-selected', 'true');
    trigger.tabIndex = 0;
    addClass(trigger, 'active');
    trigger.focus();

    // Show content
    content.style.display = 'block';

    this.activeTab = tab;
    this.options.onShown?.(id);
  }

  public getActiveTab(): string | null {
    return this.activeTab?.id || null;
  }

  public destroy(): void {
    if (this.options.keyboard) {
      this.element.removeEventListener('keydown', this.boundHandleKeydown);
    }

    this.tabs.forEach(tab => {
      tab.trigger.removeEventListener('click', () => this.activate(tab.id));
      
      // Remove ARIA attributes
      tab.trigger.removeAttribute('role');
      tab.trigger.removeAttribute('aria-controls');
      tab.trigger.removeAttribute('aria-selected');
      tab.content.removeAttribute('role');
      tab.content.removeAttribute('aria-labelledby');
    });

    const tabList = this.element.querySelector('.cl-tabs-list');
    if (tabList) {
      tabList.removeAttribute('role');
    }

    super.destroy();
  }
}
