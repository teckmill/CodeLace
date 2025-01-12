import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, hasClass } from '../util';

interface ButtonOptions extends ComponentOptions {
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: MouseEvent) => void;
}

export default class Button extends BaseComponent {
  protected declare options: ButtonOptions;
  private originalContent: string = '';

  protected getDefaultOptions(): ButtonOptions {
    return {
      ...super.getDefaultOptions(),
      loading: false,
      disabled: false,
      onClick: undefined
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;
    
    addClass(this.element, 'cl-btn');
    this.originalContent = this.element.innerHTML;
    
    if (this.options.loading) {
      this.setLoading(true);
    }
    
    if (this.options.disabled) {
      this.setDisabled(true);
    }

    if (this.options.onClick) {
      this.element.addEventListener('click', this.options.onClick);
    }
  }

  public setLoading(loading: boolean): void {
    if (!(this.element instanceof HTMLElement)) return;
    
    if (loading) {
      this.element.setAttribute('data-loading', '');
      this.element.innerHTML = '<span class="cl-spinner"></span> Loading...';
    } else {
      this.element.removeAttribute('data-loading');
      this.element.innerHTML = this.originalContent;
    }
  }

  public setDisabled(disabled: boolean): void {
    if (!(this.element instanceof HTMLElement)) return;
    
    if (disabled) {
      this.element.setAttribute('disabled', '');
      addClass(this.element, 'cl-btn-disabled');
    } else {
      this.element.removeAttribute('disabled');
      removeClass(this.element, 'cl-btn-disabled');
    }
  }

  public destroy(): void {
    if (this.options.onClick && this.element instanceof HTMLElement) {
      this.element.removeEventListener('click', this.options.onClick);
    }
  }
}
