import { Component } from '../core/component';
import { EventHandler } from '../utils/event-handler';
import { getElement, getElements } from '../utils/dom';

export interface DropdownOptions {
  rtl?: boolean;
  placement?: 'top' | 'bottom' | 'start' | 'end';
  offset?: [number, number];
  reference?: 'toggle' | 'parent';
}

export default class Dropdown extends Component {
  private static readonly SELECTORS = {
    TOGGLE: '[data-cl-toggle="dropdown"]',
    MENU: '.cl-dropdown-menu',
    ITEM: '.cl-dropdown-item',
    DIVIDER: '.cl-dropdown-divider'
  };

  private static readonly CLASSES = {
    SHOW: 'cl-show',
    RTL: 'cl-rtl',
    PLACEMENT: {
      TOP: 'cl-dropdown-menu-top',
      BOTTOM: 'cl-dropdown-menu-bottom',
      START: 'cl-dropdown-menu-start',
      END: 'cl-dropdown-menu-end'
    }
  };

  private readonly options: DropdownOptions;
  private menu: HTMLElement | null;
  private isOpen: boolean;

  constructor(element: HTMLElement, options: DropdownOptions = {}) {
    super(element);

    this.options = {
      rtl: false,
      placement: 'bottom',
      offset: [0, 0],
      reference: 'toggle',
      ...options
    };

    this.menu = getElement(Dropdown.SELECTORS.MENU, this.element);
    this.isOpen = false;

    this.init();
  }

  private init(): void {
    // Add RTL class if needed
    if (this.options.rtl) {
      this.element.classList.add(Dropdown.CLASSES.RTL);
    }

    // Add placement class
    if (this.menu) {
      const placementClass = this.getPlacementClass();
      if (placementClass) {
        this.menu.classList.add(placementClass);
      }
    }

    // Add event listeners for dropdown toggle
    EventHandler.on<'click'>(
      this.element,
      'click',
      Dropdown.SELECTORS.TOGGLE,
      (event) => {
        event.preventDefault();
        this.toggle();
      }
    );

    // Add keyboard navigation
    EventHandler.on<'keydown'>(
      this.element,
      'keydown',
      Dropdown.SELECTORS.TOGGLE,
      (event) => this.handleKeyDown(event)
    );

    // Handle direction changes
    document.documentElement.addEventListener('directionchange', (event: Event) => {
      if (event instanceof CustomEvent) {
        const isRTL = event.detail.direction === 'rtl';
        this.element.classList.toggle(Dropdown.CLASSES.RTL, isRTL);
        this.options.rtl = isRTL;
        this.updatePlacement();
      }
    });

    // Handle clicks outside dropdown
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!this.element.contains(target) && this.isOpen) {
        this.hide();
      }
    });
  }

  private getPlacementClass(): string {
    const { placement } = this.options;
    switch (placement) {
      case 'top':
        return Dropdown.CLASSES.PLACEMENT.TOP;
      case 'bottom':
        return Dropdown.CLASSES.PLACEMENT.BOTTOM;
      case 'start':
        return this.options.rtl
          ? Dropdown.CLASSES.PLACEMENT.END
          : Dropdown.CLASSES.PLACEMENT.START;
      case 'end':
        return this.options.rtl
          ? Dropdown.CLASSES.PLACEMENT.START
          : Dropdown.CLASSES.PLACEMENT.END;
      default:
        return Dropdown.CLASSES.PLACEMENT.BOTTOM;
    }
  }

  private updatePlacement(): void {
    if (!this.menu) return;

    // Remove existing placement classes
    Object.values(Dropdown.CLASSES.PLACEMENT).forEach(className => {
      this.menu?.classList.remove(className);
    });

    // Add new placement class
    const placementClass = this.getPlacementClass();
    if (placementClass) {
      this.menu.classList.add(placementClass);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!this.menu) return;

    const items = Array.from(
      getElements(Dropdown.SELECTORS.ITEM, this.menu)
    ) as HTMLElement[];

    const key = event.key;
    const isRTL = this.options.rtl;

    switch (key) {
      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem(items);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem(items);
        break;

      case isRTL ? 'ArrowLeft' : 'ArrowRight':
        event.preventDefault();
        if (this.isOpen) {
          this.focusNextItem(items);
        } else {
          this.show();
        }
        break;

      case isRTL ? 'ArrowRight' : 'ArrowLeft':
        event.preventDefault();
        if (this.isOpen) {
          this.focusPreviousItem(items);
        } else {
          this.hide();
        }
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggle();
        break;

      case 'Escape':
        event.preventDefault();
        this.hide();
        break;
    }
  }

  private focusNextItem(items: HTMLElement[]): void {
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(activeElement);
    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % items.length;
    items[nextIndex].focus();
  }

  private focusPreviousItem(items: HTMLElement[]): void {
    const activeElement = document.activeElement as HTMLElement;
    const currentIndex = items.indexOf(activeElement);
    const previousIndex = currentIndex === -1 ? 0 : (currentIndex - 1 + items.length) % items.length;
    items[previousIndex].focus();
  }

  private show(): void {
    if (!this.menu || this.isOpen) return;

    this.menu.classList.add(Dropdown.CLASSES.SHOW);
    this.isOpen = true;

    // Update ARIA attributes
    const toggle = getElement(Dropdown.SELECTORS.TOGGLE, this.element) as HTMLElement;
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'true');
    }

    // Focus first item
    const firstItem = getElement(Dropdown.SELECTORS.ITEM, this.menu) as HTMLElement;
    if (firstItem) {
      firstItem.focus();
    }

    EventHandler.trigger(this.element, 'cl.dropdown.shown');
  }

  private hide(): void {
    if (!this.menu || !this.isOpen) return;

    this.menu.classList.remove(Dropdown.CLASSES.SHOW);
    this.isOpen = false;

    // Update ARIA attributes
    const toggle = getElement(Dropdown.SELECTORS.TOGGLE, this.element) as HTMLElement;
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
    }

    EventHandler.trigger(this.element, 'cl.dropdown.hidden');
  }

  private toggle(): void {
    if (this.isOpen) {
      this.hide();
    } else {
      this.show();
    }
  }

  public destroy(): void {
    // Remove event listeners
    EventHandler.off(this.element, 'click');
    EventHandler.off(this.element, 'keydown');

    // Remove classes
    this.element.classList.remove(Dropdown.CLASSES.RTL);
    if (this.menu) {
      this.menu.classList.remove(
        Dropdown.CLASSES.SHOW,
        ...Object.values(Dropdown.CLASSES.PLACEMENT)
      );
    }

    // Reset state
    this.isOpen = false;
  }
}
