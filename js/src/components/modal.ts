import { Component } from '../core/component';
import { EventHandler } from '../utils/event-handler';
import { getElement, getElements } from '../utils/dom';

export interface ModalOptions {
  keyboard?: boolean;
  backdrop?: boolean | 'static';
  focus?: boolean;
  rtl?: boolean;
}

export default class Modal extends Component {
  private static readonly SELECTORS = {
    DIALOG: '.cl-modal-dialog',
    MODAL_BODY: '.cl-modal-body',
    DATA_DISMISS: '[data-cl-dismiss="modal"]',
    DATA_TOGGLE: '[data-cl-toggle="modal"]',
    FIXED_CONTENT: '.cl-fixed-top, .cl-fixed-bottom, .cl-is-fixed, .cl-sticky-top',
    STICKY_CONTENT: '.cl-sticky-top',
    BACKDROP: 'cl-modal-backdrop'
  };

  private static readonly CLASSES = {
    OPEN: 'cl-modal-open',
    FADE: 'cl-fade',
    SHOW: 'cl-show',
    RTL: 'cl-rtl',
    STATIC: 'cl-modal-static'
  };

  private readonly options: ModalOptions;
  private dialog: HTMLElement | null;
  private backdrop: HTMLElement | null;
  private isShown: boolean;
  private isTransitioning: boolean;
  private ignoreBackdropClick: boolean;
  private isBodyOverflowing: boolean;
  private originalBodyPadding: number;
  private scrollbarWidth: number;

  constructor(element: HTMLElement, options: ModalOptions = {}) {
    super(element);

    this.options = {
      keyboard: true,
      backdrop: true,
      focus: true,
      rtl: false,
      ...options
    };

    this.dialog = getElement(Modal.SELECTORS.DIALOG, this.element);
    this.backdrop = null;
    this.isShown = false;
    this.isTransitioning = false;
    this.ignoreBackdropClick = false;
    this.isBodyOverflowing = false;
    this.originalBodyPadding = 0;
    this.scrollbarWidth = 0;

    this.init();
  }

  private init(): void {
    if (this.options.rtl) {
      this.element.classList.add(Modal.CLASSES.RTL);
    }

    EventHandler.on<'click'>(
      this.element,
      'click',
      Modal.SELECTORS.DATA_DISMISS,
      (event) => {
        event.preventDefault();
        this.hide();
      }
    );

    // Handle direction changes
    document.documentElement.addEventListener('directionchange', (event: Event) => {
      if (event instanceof CustomEvent) {
        const isRTL = event.detail.direction === 'rtl';
        this.element.classList.toggle(Modal.CLASSES.RTL, isRTL);
        this.options.rtl = isRTL;
      }
    });

    // Create modal structure if not exists
    if (!this.dialog) {
      this.createModalStructure();
    }
  }

  private createModalStructure(): void {
    // Create dialog
    const dialog = document.createElement('div');
    dialog.className = 'cl-modal-dialog';
    
    // Create content
    const content = document.createElement('div');
    content.className = 'cl-modal-content';

    // Create header
    const header = document.createElement('div');
    header.className = 'cl-modal-header';

    // Create title
    const title = document.createElement('h5');
    title.className = 'cl-modal-title';
    title.textContent = this.element.getAttribute('data-cl-title') || 'Modal Title';

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.className = 'cl-btn-close';
    closeButton.setAttribute('data-cl-dismiss', 'modal');
    closeButton.setAttribute('aria-label', 'Close');

    // Create body
    const body = document.createElement('div');
    body.className = 'cl-modal-body';

    // Move existing content to body
    while (this.element.firstChild) {
      body.appendChild(this.element.firstChild);
    }

    // Assemble modal
    header.appendChild(title);
    header.appendChild(closeButton);
    content.appendChild(header);
    content.appendChild(body);
    dialog.appendChild(content);
    this.element.appendChild(dialog);

    this.dialog = dialog;
  }

  private adjustDialog(): void {
    const isModalOverflowing =
      this.element.scrollHeight > document.documentElement.clientHeight;

    if (!this.isBodyOverflowing && isModalOverflowing) {
      this.element.style.paddingLeft = `${this.scrollbarWidth}px`;
    }

    if (this.isBodyOverflowing && !isModalOverflowing) {
      this.element.style.paddingRight = `${this.scrollbarWidth}px`;
    }
  }

  private setScrollbar(): void {
    const rect = document.body.getBoundingClientRect();
    this.isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
    this.originalBodyPadding = parseInt(
      getComputedStyle(document.body).getPropertyValue('padding-right')
    ) || 0;

    if (this.isBodyOverflowing) {
      document.body.style.paddingRight = `${this.originalBodyPadding + this.scrollbarWidth}px`;
    }
  }

  private resetScrollbar(): void {
    document.body.style.paddingRight = `${this.originalBodyPadding}px`;
  }

  private createBackdrop(): void {
    const backdrop = document.createElement('div');
    backdrop.className = `${Modal.SELECTORS.BACKDROP} ${Modal.CLASSES.FADE}`;
    this.backdrop = backdrop;
    document.body.appendChild(backdrop);

    backdrop.addEventListener('transitionend', () => {
      if (this.element) {
        this.element.focus();
      }
    }, { once: true });

    setTimeout(() => {
      if (this.backdrop) {
        this.backdrop.classList.add(Modal.CLASSES.SHOW);
      }
    }, 0);
  }

  private removeBackdrop(): void {
    if (this.backdrop) {
      this.backdrop.classList.remove(Modal.CLASSES.SHOW);

      this.backdrop.addEventListener('transitionend', () => {
        this.backdrop?.parentNode?.removeChild(this.backdrop);
        this.backdrop = null;
      }, { once: true });
    }
  }

  public show(): void {
    if (this.isShown || this.isTransitioning) {
      return;
    }

    if (this.isAnimated()) {
      this.isTransitioning = true;
    }

    document.body.classList.add(Modal.CLASSES.OPEN);

    this.setScrollbar();
    this.adjustDialog();

    if (this.options.backdrop) {
      this.createBackdrop();
    }

    this.element.style.display = 'block';
    this.element.removeAttribute('aria-hidden');
    this.element.setAttribute('aria-modal', 'true');
    this.element.setAttribute('role', 'dialog');

    if (this.dialog) {
      this.dialog.scrollTop = 0;
    }

    if (this.isAnimated()) {
      this.element.offsetHeight; // Force reflow
    }

    this.element.classList.add(Modal.CLASSES.SHOW);
    this.isShown = true;

    EventHandler.trigger(this.element, 'cl.modal.shown');
  }

  public hide(): void {
    if (!this.isShown || this.isTransitioning) {
      return;
    }

    if (this.isAnimated()) {
      this.isTransitioning = true;
    }

    this.element.classList.remove(Modal.CLASSES.SHOW);

    if (this.isAnimated()) {
      this.awaitTransition(() => this.hideModal());
    } else {
      this.hideModal();
    }
  }

  private hideModal(): void {
    this.element.style.display = 'none';
    this.element.setAttribute('aria-hidden', 'true');
    this.element.removeAttribute('aria-modal');
    this.isTransitioning = false;

    this.removeBackdrop();

    document.body.classList.remove(Modal.CLASSES.OPEN);
    this.resetScrollbar();
    this.isShown = false;

    EventHandler.trigger(this.element, 'cl.modal.hidden');
  }

  private awaitTransition(handler: () => void): void {
    if (this.isAnimated()) {
      this.element.addEventListener('transitionend', () => {
        handler();
      }, { once: true });
    } else {
      handler();
    }
  }

  private isAnimated(): boolean {
    return this.element.classList.contains(Modal.CLASSES.FADE);
  }

  public destroy(): void {
    if (this.isShown) {
      this.hide();
    }

    EventHandler.off(this.element, 'click');

    if (this.backdrop) {
      this.backdrop.parentNode?.removeChild(this.backdrop);
    }

    this.element.classList.remove(Modal.CLASSES.RTL);
  }
}
