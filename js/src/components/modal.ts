import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, fadeIn, fadeOut } from '../util';

interface ModalOptions extends ComponentOptions {
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  focus?: boolean;
  onShow?: () => void;
  onShown?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

export default class Modal extends BaseComponent {
  protected declare options: ModalOptions;
  private backdrop: HTMLElement | null = null;
  private isShown = false;
  private scrollbarWidth = 0;
  private originalBodyPadding = '';

  protected getDefaultOptions(): ModalOptions {
    return {
      ...super.getDefaultOptions(),
      backdrop: true,
      keyboard: true,
      focus: true,
      onShow: () => {},
      onShown: () => {},
      onHide: () => {},
      onHidden: () => {}
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;

    addClass(this.element, 'cl-modal');
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    
    // Create backdrop if needed
    if (this.options.backdrop) {
      this.createBackdrop();
    }

    // Bind events
    this.bindEvents();
  }

  private createBackdrop(): void {
    this.backdrop = document.createElement('div');
    addClass(this.backdrop, 'cl-modal-backdrop');
    document.body.appendChild(this.backdrop);
  }

  private bindEvents(): void {
    if (!(this.element instanceof HTMLElement)) return;

    // Close button click
    const closeButtons = this.element.querySelectorAll('[data-dismiss="modal"]');
    closeButtons.forEach(button => {
      button.addEventListener('click', () => this.hide());
    });

    // Backdrop click
    if (this.backdrop && this.options.backdrop !== 'static') {
      this.backdrop.addEventListener('click', () => this.hide());
    }

    // Escape key
    if (this.options.keyboard) {
      document.addEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.isShown) {
          this.hide();
        }
      });
    }
  }

  private setScrollbar(): void {
    const windowWidth = document.documentElement.clientWidth;
    const bodyWidth = document.body.clientWidth;
    this.scrollbarWidth = windowWidth - bodyWidth;

    if (this.scrollbarWidth > 0) {
      this.originalBodyPadding = document.body.style.paddingRight;
      document.body.style.paddingRight = `${this.scrollbarWidth}px`;
    }
  }

  private resetScrollbar(): void {
    document.body.style.paddingRight = this.originalBodyPadding;
  }

  public async show(): Promise<void> {
    if (this.isShown || !(this.element instanceof HTMLElement)) return;

    this.options.onShow?.();
    this.isShown = true;

    // Handle scrollbar
    this.setScrollbar();
    addClass(document.body, 'cl-modal-open');

    // Show backdrop
    if (this.backdrop) {
      this.backdrop.style.display = 'block';
      await fadeIn(this.backdrop);
    }

    // Show modal
    this.element.style.display = 'block';
    await fadeIn(this.element);

    if (this.options.focus) {
      const firstInput = this.element.querySelector('input, button, [tabindex]');
      if (firstInput instanceof HTMLElement) {
        firstInput.focus();
      }
    }

    this.options.onShown?.();
  }

  public async hide(): Promise<void> {
    if (!this.isShown || !(this.element instanceof HTMLElement)) return;

    this.options.onHide?.();

    // Hide modal
    await fadeOut(this.element);

    // Hide backdrop
    if (this.backdrop) {
      await fadeOut(this.backdrop);
    }

    this.isShown = false;
    removeClass(document.body, 'cl-modal-open');
    this.resetScrollbar();

    this.options.onHidden?.();
  }

  public destroy(): void {
    if (this.backdrop) {
      this.backdrop.remove();
    }

    if (this.options.keyboard) {
      document.removeEventListener('keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape' && this.isShown) {
          this.hide();
        }
      });
    }

    super.destroy();
  }
}
