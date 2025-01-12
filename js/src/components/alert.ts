import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, fadeOut } from '../util';

interface AlertOptions extends ComponentOptions {
  dismissible?: boolean;
  duration?: number;
  onClose?: () => void;
}

export default class Alert extends BaseComponent {
  protected declare options: AlertOptions;
  private closeButton: HTMLElement | null = null;

  protected getDefaultOptions(): AlertOptions {
    return {
      ...super.getDefaultOptions(),
      dismissible: true,
      duration: 0,
      onClose: () => {}
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;
    
    addClass(this.element, 'cl-alert');
    
    if (this.options.dismissible) {
      this.setupDismissButton();
    }

    const duration = this.options.duration ?? 0;
    if (duration > 0) {
      setTimeout(() => this.close(), duration);
    }
  }

  private setupDismissButton(): void {
    if (!(this.element instanceof HTMLElement)) return;
    
    this.closeButton = document.createElement('button');
    this.closeButton.className = 'cl-alert-close';
    this.closeButton.innerHTML = '&times;';
    this.closeButton.addEventListener('click', () => this.close());
    this.element.appendChild(this.closeButton);
  }

  public async close(): Promise<void> {
    if (!(this.element instanceof HTMLElement)) return;

    await fadeOut(this.element);
    this.element.remove();
    this.options.onClose?.();
  }

  public destroy(): void {
    if (this.closeButton) {
      this.closeButton.removeEventListener('click', () => this.close());
    }
    super.destroy();
  }
}
