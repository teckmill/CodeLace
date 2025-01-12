import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, fadeIn, fadeOut } from '../util';

interface ModalOptions extends ComponentOptions {
  backdrop?: boolean | 'static';
  keyboard?: boolean;
  focus?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  centered?: boolean;
  scrollable?: boolean;
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
  private previousActiveElement: HTMLElement | null = null;
  private focusableElements: HTMLElement[] = [];
  private firstFocusable: HTMLElement | null = null;
  private lastFocusable: HTMLElement | null = null;

  protected getDefaultOptions(): ModalOptions {
    return {
      ...super.getDefaultOptions(),
      backdrop: true,
      keyboard: true,
      focus: true,
      size: 'md',
      centered: false,
      scrollable: false,
      onShow: () => {},
      onShown: () => {},
      onHide: () => {},
      onHidden: () => {}
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;

    addClass(this.element, 'cl-modal');
    
    // Set ARIA attributes
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.setAttribute('aria-hidden', 'true');
    
    // Add size class if specified
    if (this.options.size) {
      addClass(this.element, `cl-modal-${this.options.size}`);
    }
    
    // Add centered class if specified
    if (this.options.centered) {
      addClass(this.element, 'cl-modal-centered');
    }
    
    // Add scrollable class if specified
    if (this.options.scrollable) {
      addClass(this.element, 'cl-modal-scrollable');
    }
    
    // Ensure proper dialog structure
    this.setupDialogStructure();
    
    // Create backdrop if needed
    if (this.options.backdrop) {
      this.createBackdrop();
    }

    // Find and store focusable elements
    this.updateFocusableElements();

    // Bind events
    this.bindEvents();
  }

  private setupDialogStructure(): void {
    if (!(this.element instanceof HTMLElement)) return;

    // Ensure proper dialog structure
    const dialog = this.element.querySelector('.cl-modal-dialog');
    if (dialog) {
      dialog.setAttribute('role', 'document');
      
      // Find or create header
      let header = dialog.querySelector('.cl-modal-header');
      if (!header) {
        header = document.createElement('div');
        addClass(header, 'cl-modal-header');
        dialog.insertBefore(header, dialog.firstChild);
      }

      // Find or create title
      let title = header.querySelector('.cl-modal-title');
      if (!title) {
        title = document.createElement('h5');
        addClass(title, 'cl-modal-title');
        header.insertBefore(title, header.firstChild);
      }

      // Set aria-labelledby
      if (!title.id) {
        title.id = `${this.element.id}-title`;
      }
      this.element.setAttribute('aria-labelledby', title.id);

      // Ensure close button has proper attributes
      const closeButton = header.querySelector('[data-dismiss="modal"]');
      if (closeButton) {
        closeButton.setAttribute('aria-label', 'Close modal');
        if (!closeButton.innerHTML.trim()) {
          closeButton.innerHTML = '<span aria-hidden="true">&times;</span>';
        }
      }

      // Find or create body
      let body = dialog.querySelector('.cl-modal-body');
      if (!body) {
        body = document.createElement('div');
        addClass(body, 'cl-modal-body');
        dialog.appendChild(body);
      }
    }
  }

  private createBackdrop(): void {
    this.backdrop = document.createElement('div');
    addClass(this.backdrop, 'cl-modal-backdrop');
    this.backdrop.setAttribute('aria-hidden', 'true');
    document.body.appendChild(this.backdrop);
  }

  private updateFocusableElements(): void {
    if (!(this.element instanceof HTMLElement)) return;

    this.focusableElements = Array.from(
      this.element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter((el): el is HTMLElement => el instanceof HTMLElement && el.tabIndex !== -1);

    this.firstFocusable = this.focusableElements[0] || null;
    this.lastFocusable = this.focusableElements[this.focusableElements.length - 1] || null;
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

    // Keyboard events
    this.element.addEventListener('keydown', this.handleKeydown.bind(this));
  }

  private handleKeydown(event: KeyboardEvent): void {
    if (!this.isShown) return;

    // Handle Escape key
    if (this.options.keyboard && event.key === 'Escape') {
      event.preventDefault();
      this.hide();
      return;
    }

    // Handle Tab key for focus trap
    if (event.key === 'Tab') {
      if (!this.focusableElements.length) return;

      const isTabPressed = !event.shiftKey;
      const isShiftTabPressed = event.shiftKey;

      if (!document.activeElement) return;

      // Handle regular tab
      if (isTabPressed && document.activeElement === this.lastFocusable) {
        event.preventDefault();
        this.firstFocusable?.focus();
      }

      // Handle shift + tab
      if (isShiftTabPressed && document.activeElement === this.firstFocusable) {
        event.preventDefault();
        this.lastFocusable?.focus();
      }
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

    // Store the currently focused element
    this.previousActiveElement = document.activeElement as HTMLElement;

    this.options.onShow?.();
    this.isShown = true;

    // Update ARIA attributes
    this.element.setAttribute('aria-hidden', 'false');

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

    // Update focusable elements
    this.updateFocusableElements();

    // Set focus
    if (this.options.focus) {
      const defaultFocus = this.element.querySelector('[data-modal-focus]');
      if (defaultFocus instanceof HTMLElement) {
        defaultFocus.focus();
      } else {
        this.firstFocusable?.focus();
      }
    }

    // Announce to screen readers
    const title = this.element.querySelector('.cl-modal-title');
    if (title) {
      const announcement = document.createElement('div');
      announcement.setAttribute('aria-live', 'polite');
      announcement.classList.add('cl-sr-only');
      announcement.textContent = `Dialog opened: ${title.textContent}`;
      this.element.appendChild(announcement);
      
      // Remove announcement after it's been read
      setTimeout(() => announcement.remove(), 1000);
    }

    this.options.onShown?.();
  }

  public async hide(): Promise<void> {
    if (!this.isShown || !(this.element instanceof HTMLElement)) return;

    this.options.onHide?.();

    // Update ARIA attributes
    this.element.setAttribute('aria-hidden', 'true');

    // Hide modal
    await fadeOut(this.element);
    this.element.style.display = 'none';

    // Hide backdrop
    if (this.backdrop) {
      await fadeOut(this.backdrop);
      this.backdrop.style.display = 'none';
    }

    this.isShown = false;
    removeClass(document.body, 'cl-modal-open');
    this.resetScrollbar();

    // Restore focus to previous element
    if (this.previousActiveElement instanceof HTMLElement) {
      this.previousActiveElement.focus();
      this.previousActiveElement = null;
    }

    // Announce to screen readers
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.classList.add('cl-sr-only');
    announcement.textContent = 'Dialog closed';
    document.body.appendChild(announcement);
    
    // Remove announcement after it's been read
    setTimeout(() => announcement.remove(), 1000);

    this.options.onHidden?.();
  }

  public destroy(): void {
    if (this.backdrop) {
      this.backdrop.remove();
    }

    // Remove event listeners
    this.element.removeEventListener('keydown', this.handleKeydown.bind(this));

    // Remove ARIA attributes
    this.element.removeAttribute('role');
    this.element.removeAttribute('aria-modal');
    this.element.removeAttribute('aria-hidden');
    this.element.removeAttribute('aria-labelledby');

    // Remove classes
    removeClass(this.element, 'cl-modal');
    removeClass(this.element, `cl-modal-${this.options.size}`);
    if (this.options.centered) {
      removeClass(this.element, 'cl-modal-centered');
    }
    if (this.options.scrollable) {
      removeClass(this.element, 'cl-modal-scrollable');
    }

    super.destroy();
  }
}
