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
  private clickOutsideHandler = (event: MouseEvent): void => {
    if (!(event.target instanceof Node)) return;
    if (this.element && !this.element.contains(event.target)) {
      this.hide();
    }
  };

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

    addClass(this.trigger, 'cl-dropdown-toggle');
    this.trigger.setAttribute('aria-haspopup', 'true');
    this.trigger.setAttribute('aria-expanded', 'false');
  }

  private initializeMenu(): void {
    if (!this.menu) return;

    addClass(this.menu, 'cl-dropdown-menu');
    this.menu.setAttribute('aria-hidden', 'true');
    
    // Set initial position
    this.updateMenuPosition();
  }

  private bindEvents(): void {
    if (!this.trigger || !this.menu) return;

    if (this.options.hover) {
      this.element?.addEventListener('mouseenter', () => this.show());
      this.element?.addEventListener('mouseleave', () => this.hide());
    } else {
      this.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });
    }

    if (this.options.closeOnClick) {
      this.menu.addEventListener('click', (e) => {
        if ((e.target as HTMLElement).closest('a, button')) {
          this.hide();
        }
      });
    }
  }

  private updateMenuPosition(): void {
    if (!this.menu || !this.trigger) return;

    const triggerRect = this.trigger.getBoundingClientRect();
    const offset = this.options.offset ?? 0;

    switch (this.options.placement) {
      case 'top':
        Object.assign(this.menu.style, {
          bottom: '100%',
          left: '0',
          marginBottom: `${offset}px`
        });
        break;
      case 'right':
        Object.assign(this.menu.style, {
          top: '0',
          left: '100%',
          marginLeft: `${offset}px`
        });
        break;
      case 'left':
        Object.assign(this.menu.style, {
          top: '0',
          right: '100%',
          marginRight: `${offset}px`
        });
        break;
      default: // bottom
        Object.assign(this.menu.style, {
          top: '100%',
          left: '0',
          marginTop: `${offset}px`
        });
    }
  }

  public async show(): Promise<void> {
    if (this.isShown || !this.menu || !this.trigger) return;

    this.options.onShow?.();
    this.isShown = true;

    this.trigger.setAttribute('aria-expanded', 'true');
    this.menu.setAttribute('aria-hidden', 'false');

    // Add click outside listener
    document.addEventListener('click', this.clickOutsideHandler);

    // Show menu with animation
    await fadeIn(this.menu);
  }

  public async hide(): Promise<void> {
    if (!this.isShown || !this.menu || !this.trigger) return;

    this.options.onHide?.();
    this.isShown = false;

    this.trigger.setAttribute('aria-expanded', 'false');
    this.menu.setAttribute('aria-hidden', 'true');

    // Remove click outside listener
    document.removeEventListener('click', this.clickOutsideHandler);

    // Hide menu with animation
    await fadeOut(this.menu);
  }

  public toggle(): void {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  public destroy(): void {
    if (this.trigger) {
      this.trigger.removeEventListener('click', () => this.toggle());
    }

    if (this.menu) {
      this.menu.removeEventListener('click', () => this.hide());
    }

    if (this.element) {
      this.element.removeEventListener('mouseenter', () => this.show());
      this.element.removeEventListener('mouseleave', () => this.hide());
    }

    document.removeEventListener('click', this.clickOutsideHandler);
    super.destroy();
  }
}
