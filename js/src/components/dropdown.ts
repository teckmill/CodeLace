import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, hasClass, fadeIn, fadeOut } from '../util';

interface DropdownOptions extends ComponentOptions {
  placement?: 'top' | 'bottom' | 'left' | 'right';
  offset?: number;
  hover?: boolean;
  closeOnClick?: boolean;
  onShow?: () => void;
  onHide?: () => void;
}

export default class Dropdown extends BaseComponent {
  protected declare options: DropdownOptions;
  private menu: HTMLElement | null = null;
  private trigger: HTMLElement | null = null;
  private isShown = false;
  private clickOutsideHandler: (event: MouseEvent) => void;

  protected getDefaultOptions(): DropdownOptions {
    return {
      ...super.getDefaultOptions(),
      placement: 'bottom',
      offset: 5,
      hover: false,
      closeOnClick: true,
      onShow: () => {},
      onHide: () => {}
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;

    addClass(this.element, 'cl-dropdown');
    
    // Find trigger and menu elements
    this.trigger = this.element.querySelector('[data-toggle="dropdown"]');
    this.menu = this.element.querySelector('.cl-dropdown-menu');

    if (!this.trigger || !this.menu) {
      console.error('Dropdown requires a trigger and menu element');
      return;
    }

    // Initialize elements
    this.initializeTrigger();
    this.initializeMenu();
    this.bindEvents();
  }

  private initializeTrigger(): void {
    if (!this.trigger) return;

    this.trigger.setAttribute('aria-haspopup', 'true');
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  private initializeMenu(): void {
    if (!this.menu) return;

    addClass(this.menu, 'cl-dropdown-menu');
    this.menu.setAttribute('role', 'menu');
    this.menu.style.position = 'absolute';
  }

  private bindEvents(): void {
    if (!this.trigger || !this.menu) return;

    // Click events
    this.trigger.addEventListener('click', (e) => {
      e.preventDefault();
      this.toggle();
    });

    // Hover events
    if (this.options.hover) {
      this.element.addEventListener('mouseenter', () => this.show());
      this.element.addEventListener('mouseleave', () => this.hide());
    }

    // Close on click outside
    this.clickOutsideHandler = this.handleClickOutside.bind(this);
  }

  private handleClickOutside(event: MouseEvent): void {
    if (!this.element.contains(event.target as Node)) {
      this.hide();
    }
  }

  private updatePosition(): void {
    if (!this.trigger || !this.menu) return;

    const triggerRect = this.trigger.getBoundingClientRect();
    const { placement, offset } = this.options;

    switch (placement) {
      case 'top':
        this.menu.style.bottom = `${window.innerHeight - triggerRect.top + offset!}px`;
        this.menu.style.left = `${triggerRect.left}px`;
        break;
      case 'right':
        this.menu.style.top = `${triggerRect.top}px`;
        this.menu.style.left = `${triggerRect.right + offset!}px`;
        break;
      case 'left':
        this.menu.style.top = `${triggerRect.top}px`;
        this.menu.style.right = `${window.innerWidth - triggerRect.left + offset!}px`;
        break;
      default: // bottom
        this.menu.style.top = `${triggerRect.bottom + offset!}px`;
        this.menu.style.left = `${triggerRect.left}px`;
    }
  }

  public async show(): Promise<void> {
    if (this.isShown || !this.menu || !this.trigger) return;

    this.options.onShow?.();
    this.isShown = true;

    // Update ARIA
    this.trigger.setAttribute('aria-expanded', 'true');

    // Position the menu
    this.updatePosition();

    // Show the menu
    await fadeIn(this.menu);

    // Add click outside listener
    document.addEventListener('click', this.clickOutsideHandler);
  }

  public async hide(): Promise<void> {
    if (!this.isShown || !this.menu || !this.trigger) return;

    this.options.onHide?.();

    // Update ARIA
    this.trigger.setAttribute('aria-expanded', 'false');

    // Hide the menu
    await fadeOut(this.menu);

    this.isShown = false;

    // Remove click outside listener
    document.removeEventListener('click', this.clickOutsideHandler);
  }

  public toggle(): void {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  public destroy(): void {
    document.removeEventListener('click', this.clickOutsideHandler);

    if (this.options.hover) {
      this.element.removeEventListener('mouseenter', () => this.show());
      this.element.removeEventListener('mouseleave', () => this.hide());
    }

    if (this.trigger) {
      this.trigger.removeEventListener('click', () => this.toggle());
    }

    super.destroy();
  }
}
