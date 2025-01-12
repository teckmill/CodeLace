import { Component } from '../core/component';
import { getElement, getElements, reflow } from '../utils/dom';
import { EventHandler } from '../utils/event-handler';

export interface TabOptions {
  activeTab?: string;
  rtl?: boolean;
}

export class Tab extends Component {
  private static readonly DATA_TOGGLE = 'data-cl-toggle';
  private static readonly DATA_TARGET = 'data-cl-target';
  private static readonly ACTIVE_CLASS = 'cl-active';
  private static readonly FADE_CLASS = 'cl-fade';
  private static readonly SHOW_CLASS = 'cl-show';

  private readonly options: TabOptions;
  private readonly tabs: HTMLElement[];
  private readonly panes: HTMLElement[];
  private activeTab: HTMLElement | null;

  constructor(element: HTMLElement, options: TabOptions = {}) {
    super(element);

    this.options = {
      activeTab: '',
      rtl: false,
      ...options
    };

    this.tabs = Array.from(getElements<HTMLElement>('[data-cl-toggle="tab"]', this.element));
    this.panes = this.tabs.map(tab => {
      const target = tab.getAttribute(Tab.DATA_TARGET);
      return getElement<HTMLElement>(target!) || null;
    }).filter((pane): pane is HTMLElement => pane !== null);

    this.activeTab = null;

    this.init();
  }

  private init(): void {
    // Set initial active tab
    if (this.options.activeTab) {
      const tab = this.tabs.find(t => t.getAttribute(Tab.DATA_TARGET) === this.options.activeTab);
      if (tab) {
        this.activate(tab);
      }
    } else if (this.tabs.length) {
      this.activate(this.tabs[0]);
    }

    // Add event listeners
    EventHandler.on<'click'>(this.element, 'click', `[${Tab.DATA_TOGGLE}="tab"]`, (event) => {
      event.preventDefault();
      const tab = event.currentTarget as HTMLElement;
      this.activate(tab);
    });

    // Handle keyboard navigation
    EventHandler.on<'keydown'>(this.element, 'keydown', `[${Tab.DATA_TOGGLE}="tab"]`, (event) => {
      const target = event.target as HTMLElement;
      const key = event.key;
      const isRTL = this.options.rtl;

      let nextTab: HTMLElement | null = null;

      switch (key) {
        case isRTL ? 'ArrowLeft' : 'ArrowRight':
        case 'ArrowDown':
          event.preventDefault();
          nextTab = this.getNextTab(target);
          break;

        case isRTL ? 'ArrowRight' : 'ArrowLeft':
        case 'ArrowUp':
          event.preventDefault();
          nextTab = this.getPreviousTab(target);
          break;

        case 'Home':
          event.preventDefault();
          nextTab = this.tabs[0];
          break;

        case 'End':
          event.preventDefault();
          nextTab = this.tabs[this.tabs.length - 1];
          break;
      }

      if (nextTab) {
        nextTab.focus();
        this.activate(nextTab);
      }
    });

    // Handle direction changes
    document.documentElement.addEventListener('directionchange', (event: Event) => {
      if (event instanceof CustomEvent) {
        this.options.rtl = event.detail.direction === 'rtl';
      }
    });
  }

  private activate(tab: HTMLElement): void {
    if (this.activeTab === tab) return;

    // Deactivate current tab
    if (this.activeTab) {
      this.deactivate(this.activeTab);
    }

    // Activate new tab
    const target = tab.getAttribute(Tab.DATA_TARGET);
    const pane = getElement<HTMLElement>(target!);

    if (!pane) return;

    tab.classList.add(Tab.ACTIVE_CLASS);
    tab.setAttribute('aria-selected', 'true');
    tab.removeAttribute('tabindex');

    pane.classList.add(Tab.ACTIVE_CLASS);
    if (pane.classList.contains(Tab.FADE_CLASS)) {
      // Trigger reflow
      reflow(pane);
      pane.classList.add(Tab.SHOW_CLASS);
    }

    this.activeTab = tab;

    // Dispatch event
    EventHandler.trigger(tab, 'cl.tab.shown', {
      relatedTarget: pane
    });
  }

  private deactivate(tab: HTMLElement): void {
    const target = tab.getAttribute(Tab.DATA_TARGET);
    const pane = getElement<HTMLElement>(target!);

    if (!pane) return;

    tab.classList.remove(Tab.ACTIVE_CLASS);
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('tabindex', '-1');

    pane.classList.remove(Tab.ACTIVE_CLASS);
    if (pane.classList.contains(Tab.FADE_CLASS)) {
      pane.classList.remove(Tab.SHOW_CLASS);
    }

    // Dispatch event
    EventHandler.trigger(tab, 'cl.tab.hidden', {
      relatedTarget: pane
    });
  }

  private getNextTab(tab: HTMLElement): HTMLElement | null {
    const index = this.tabs.indexOf(tab);
    return index < this.tabs.length - 1 ? this.tabs[index + 1] : this.tabs[0];
  }

  private getPreviousTab(tab: HTMLElement): HTMLElement | null {
    const index = this.tabs.indexOf(tab);
    return index > 0 ? this.tabs[index - 1] : this.tabs[this.tabs.length - 1];
  }

  public destroy(): void {
    // Remove event listeners
    EventHandler.off(this.element, 'click');
    EventHandler.off(this.element, 'keydown');

    // Remove classes
    this.tabs.forEach(tab => {
      tab.classList.remove(Tab.ACTIVE_CLASS);
      tab.removeAttribute('aria-selected');
      tab.removeAttribute('tabindex');
    });

    this.panes.forEach(pane => {
      pane.classList.remove(Tab.ACTIVE_CLASS, Tab.SHOW_CLASS);
    });
  }
}
