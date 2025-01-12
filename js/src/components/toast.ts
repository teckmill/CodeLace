import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, fadeIn, fadeOut } from '../util';

interface ToastOptions extends ComponentOptions {
  autohide?: boolean;
  delay?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  animation?: boolean;
  onShow?: () => void;
  onShown?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

export default class Toast extends BaseComponent {
  protected declare options: ToastOptions;
  private container: HTMLElement | null = null;
  private hideTimeout: number | null = null;
  private isShown = false;

  protected getDefaultOptions(): ToastOptions {
    return {
      ...super.getDefaultOptions(),
      autohide: true,
      delay: 5000,
      position: 'top-right',
      animation: true,
      onShow: () => {},
      onShown: () => {},
      onHide: () => {},
      onHidden: () => {}
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;

    addClass(this.element, 'cl-toast');
    this.element.setAttribute('role', 'alert');
    this.element.setAttribute('aria-live', 'assertive');
    this.element.setAttribute('aria-atomic', 'true');

    this.createContainer();
    this.setupCloseButton();
    this.bindEvents();
  }

  private createContainer(): void {
    const containerId = `cl-toast-container-${this.options.position}`;
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      addClass(container, 'cl-toast-container', `cl-toast-${this.options.position}`);
      document.body.appendChild(container);
    }

    this.container = container;
  }

  private setupCloseButton(): void {
    if (!(this.element instanceof HTMLElement)) return;

    const closeButton = this.element.querySelector('[data-dismiss="toast"]');
    if (!closeButton) {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('data-dismiss', 'toast');
      addClass(button, 'cl-toast-close');
      button.innerHTML = '&times;';
      button.setAttribute('aria-label', 'Close');
      
      const header = this.element.querySelector('.cl-toast-header');
      if (header) {
        header.appendChild(button);
      } else {
        this.element.appendChild(button);
      }
    }
  }

  private bindEvents(): void {
    if (!(this.element instanceof HTMLElement)) return;

    // Close button click
    const closeButton = this.element.querySelector('[data-dismiss="toast"]');
    if (closeButton) {
      closeButton.addEventListener('click', () => this.hide());
    }

    // Mouse enter/leave for autohide
    if (this.options.autohide) {
      this.element.addEventListener('mouseenter', () => this.pause());
      this.element.addEventListener('mouseleave', () => this.resume());
    }
  }

  private startHideTimer(): void {
    if (this.options.autohide && this.options.delay) {
      this.hideTimeout = window.setTimeout(() => this.hide(), this.options.delay);
    }
  }

  private clearHideTimer(): void {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  public pause(): void {
    this.clearHideTimer();
  }

  public resume(): void {
    if (this.isShown) {
      this.startHideTimer();
    }
  }

  public async show(): Promise<void> {
    if (this.isShown || !this.container || !(this.element instanceof HTMLElement)) return;

    this.options.onShow?.();
    this.isShown = true;

    // Add to container
    this.container.appendChild(this.element);

    // Show toast
    if (this.options.animation) {
      await fadeIn(this.element);
    } else {
      this.element.style.display = 'block';
    }

    this.startHideTimer();
    this.options.onShown?.();
  }

  public async hide(): Promise<void> {
    if (!this.isShown || !(this.element instanceof HTMLElement)) return;

    this.clearHideTimer();
    this.options.onHide?.();

    // Hide toast
    if (this.options.animation) {
      await fadeOut(this.element);
    } else {
      this.element.style.display = 'none';
    }

    this.isShown = false;
    this.element.remove();
    this.options.onHidden?.();
  }

  public destroy(): void {
    this.clearHideTimer();

    if (this.element instanceof HTMLElement) {
      const closeButton = this.element.querySelector('[data-dismiss="toast"]');
      if (closeButton) {
        closeButton.removeEventListener('click', () => this.hide());
      }

      if (this.options.autohide) {
        this.element.removeEventListener('mouseenter', () => this.pause());
        this.element.removeEventListener('mouseleave', () => this.resume());
      }

      this.element.remove();
    }

    if (this.container && this.container.children.length === 0) {
      this.container.remove();
    }

    super.destroy();
  }
}
