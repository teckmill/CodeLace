import { Component } from '../core/component';
import { EventHandler } from '../utils/event-handler';
import { getElement } from '../utils/dom';

export interface NavbarOptions {
  rtl?: boolean;
  breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  sticky?: boolean;
  fixed?: 'top' | 'bottom' | null;
}

export default class Navbar extends Component {
  private static readonly SELECTORS = {
    TOGGLE: '[data-cl-toggle="navbar"]',
    COLLAPSE: '.cl-navbar-collapse',
    DROPDOWN_TOGGLE: '[data-cl-toggle="dropdown"]',
    DROPDOWN: '.cl-dropdown',
    DROPDOWN_MENU: '.cl-dropdown-menu'
  };

  private static readonly CLASSES = {
    SHOW: 'cl-show',
    COLLAPSE: 'cl-collapse',
    COLLAPSING: 'cl-collapsing',
    RTL: 'cl-rtl'
  };

  protected readonly options: NavbarOptions;
  private collapse: HTMLElement | null;

  constructor(element: HTMLElement, options: NavbarOptions = {}) {
    super(element);

    this.options = {
      rtl: false,
      breakpoint: 'lg',
      sticky: false,
      fixed: null,
      ...options
    };

    this.collapse = getElement(Navbar.SELECTORS.COLLAPSE, this.element);

    this.init();
  }

  private init(): void {
    // Add RTL class if needed
    if (this.options.rtl) {
      this.element.classList.add(Navbar.CLASSES.RTL);
    }

    // Add sticky/fixed classes
    if (this.options.sticky) {
      this.element.classList.add(Navbar.CLASSES.STICKY);
    } else if (this.options.fixed === 'top') {
      this.element.classList.add(Navbar.CLASSES.FIXED_TOP);
    } else if (this.options.fixed === 'bottom') {
      this.element.classList.add(Navbar.CLASSES.FIXED_BOTTOM);
    }

    // Add event listeners for navbar toggle
    EventHandler.on<'click'>(
      this.element,
      'click',
      Navbar.SELECTORS.TOGGLE,
      (event) => {
        event.preventDefault();
        this.toggleCollapse();
      }
    );

    // Add event listeners for dropdown toggle
    EventHandler.on<'click'>(
      this.element,
      'click',
      Navbar.SELECTORS.DROPDOWN_TOGGLE,
      (event) => {
        event.preventDefault();
        const toggle = event.currentTarget as HTMLElement;
        this.toggleDropdown(toggle);
      }
    );

    // Handle direction changes
    document.documentElement.addEventListener('directionchange', (event: Event) => {
      if (event instanceof CustomEvent) {
        const isRTL = event.detail.direction === 'rtl';
        this.element.classList.toggle(Navbar.CLASSES.RTL, isRTL);
        this.options.rtl = isRTL;
      }
    });

    // Handle clicks outside dropdowns
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!this.element.contains(target)) {
        this.closeAllDropdowns();
      }
    });
  }

  private toggleCollapse(): void {
    if (!this.collapse) return;

    const isCollapsed = this.collapse.classList.contains(Navbar.CLASSES.SHOW);
    
    if (isCollapsed) {
      this.closeCollapse();
    } else {
      this.openCollapse();
    }
  }

  private openCollapse(): void {
    if (!this.collapse) return;

    this.collapse.classList.add(Navbar.CLASSES.SHOW);
    EventHandler.trigger(this.element, 'cl.navbar.shown');
  }

  private closeCollapse(): void {
    if (!this.collapse) return;

    this.collapse.classList.remove(Navbar.CLASSES.SHOW);
    EventHandler.trigger(this.element, 'cl.navbar.hidden');
  }

  private toggleDropdown(toggle: HTMLElement): void {
    const dropdown = toggle.closest(Navbar.SELECTORS.DROPDOWN);
    if (!dropdown) return;

    const isOpen = dropdown.classList.contains(Navbar.CLASSES.SHOW);
    
    // Close other dropdowns
    this.closeAllDropdowns();

    if (!isOpen) {
      dropdown.classList.add(Navbar.CLASSES.SHOW);
      EventHandler.trigger(dropdown, 'cl.navbar.dropdown.shown');
    }
  }

  private closeAllDropdowns(): void {
    const dropdowns = this.element.querySelectorAll(Navbar.SELECTORS.DROPDOWN);
    dropdowns.forEach(dropdown => {
      if (dropdown.classList.contains(Navbar.CLASSES.SHOW)) {
        dropdown.classList.remove(Navbar.CLASSES.SHOW);
        EventHandler.trigger(dropdown, 'cl.navbar.dropdown.hidden');
      }
    });
  }

  public destroy(): void {
    // Remove event listeners
    EventHandler.off(this.element, 'click');
    
    // Remove classes
    this.element.classList.remove(
      Navbar.CLASSES.RTL,
      Navbar.CLASSES.STICKY,
      Navbar.CLASSES.FIXED_TOP,
      Navbar.CLASSES.FIXED_BOTTOM
    );

    if (this.collapse) {
      this.collapse.classList.remove(Navbar.CLASSES.SHOW);
    }

    this.closeAllDropdowns();
  }
}
