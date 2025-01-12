import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, hasClass } from '../util';

interface TabOptions extends ComponentOptions {
  activeTab?: string | null;
  keyboard?: boolean;
  vertical?: boolean;
  onShow?: (tabId: string) => void;
  onShown?: (tabId: string) => void;
  onHide?: (tabId: string) => void;
  onHidden?: (tabId: string) => void;
}

interface TabItem {
  trigger: HTMLElement;
  content: HTMLElement;
  id: string;
  panel: HTMLElement;
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
      vertical: false,
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
    const tabList = this.element.querySelector('.cl-tabs-list');
    
    // Set up tablist
    if (tabList) {
      tabList.setAttribute('role', 'tablist');
      tabList.setAttribute('aria-orientation', this.options.vertical ? 'vertical' : 'horizontal');
    }
    
    triggers.forEach((trigger, index) => {
      if (!(trigger instanceof HTMLElement)) return;

      const targetId = trigger.getAttribute('href')?.substring(1) || 
                      trigger.getAttribute('data-target')?.substring(1);
                      
      if (!targetId) return;

      const content = document.getElementById(targetId);
      if (!content) return;

      // Generate unique IDs if not present
      if (!trigger.id) {
        trigger.id = `tab-${targetId}`;
      }

      // Set up ARIA attributes for the tab
      trigger.setAttribute('role', 'tab');
      trigger.setAttribute('aria-controls', targetId);
      trigger.setAttribute('aria-selected', 'false');
      trigger.setAttribute('tabindex', '-1');
      trigger.setAttribute('aria-description', 'Press Enter or Space to activate tab');
      
      // Set up tab panel
      content.setAttribute('role', 'tabpanel');
      content.setAttribute('aria-labelledby', trigger.id);
      content.setAttribute('tabindex', '0');
      content.setAttribute('hidden', '');
      
      // Create live region for announcements
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('class', 'cl-sr-only');
      content.appendChild(liveRegion);

      // Add to tabs collection
      this.tabs.push({
        trigger,
        content,
        id: targetId,
        panel: content
      });
    });
  }

  private bindEvents(): void {
    // Click events
    this.tabs.forEach(tab => {
      tab.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.activate(tab.id);
      });

      // Add keyboard activation
      tab.trigger.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.activate(tab.id);
        }
      });

      // Focus management
      tab.trigger.addEventListener('focus', () => {
        if (!hasClass(tab.trigger, 'active')) {
          tab.trigger.setAttribute('tabindex', '0');
        }
      });

      tab.trigger.addEventListener('blur', () => {
        if (!hasClass(tab.trigger, 'active')) {
          tab.trigger.setAttribute('tabindex', '-1');
        }
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

    const isVertical = this.options.vertical;
    const isHorizontal = !isVertical;

    switch (event.key) {
      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= this.tabs.length) nextIndex = 0;
          this.activate(this.tabs[nextIndex].id);
        }
        break;

      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) nextIndex = this.tabs.length - 1;
          this.activate(this.tabs[nextIndex].id);
        }
        break;

      case 'ArrowDown':
        if (isVertical) {
          event.preventDefault();
          nextIndex = currentIndex + 1;
          if (nextIndex >= this.tabs.length) nextIndex = 0;
          this.activate(this.tabs[nextIndex].id);
        }
        break;

      case 'ArrowUp':
        if (isVertical) {
          event.preventDefault();
          nextIndex = currentIndex - 1;
          if (nextIndex < 0) nextIndex = this.tabs.length - 1;
          this.activate(this.tabs[nextIndex].id);
        }
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
    content.setAttribute('hidden', '');
    content.querySelector('.cl-sr-only')?.textContent = `Tab panel ${trigger.textContent} is now hidden`;
    
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
    
    // Show content and announce to screen readers
    content.removeAttribute('hidden');
    content.querySelector('.cl-sr-only')?.textContent = `Tab panel ${trigger.textContent} is now visible`;
    
    // Focus management
    trigger.focus();
    
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
      // Remove event listeners
      tab.trigger.removeEventListener('click', () => this.activate(tab.id));
      
      // Remove ARIA attributes
      tab.trigger.removeAttribute('role');
      tab.trigger.removeAttribute('aria-controls');
      tab.trigger.removeAttribute('aria-selected');
      tab.trigger.removeAttribute('aria-description');
      tab.trigger.removeAttribute('tabindex');
      
      tab.content.removeAttribute('role');
      tab.content.removeAttribute('aria-labelledby');
      tab.content.removeAttribute('tabindex');
      tab.content.removeAttribute('hidden');
      
      // Remove live region
      const liveRegion = tab.content.querySelector('.cl-sr-only');
      if (liveRegion) {
        liveRegion.remove();
      }
    });

    const tabList = this.element.querySelector('.cl-tabs-list');
    if (tabList) {
      tabList.removeAttribute('role');
      tabList.removeAttribute('aria-orientation');
    }

    super.destroy();
  }
}
