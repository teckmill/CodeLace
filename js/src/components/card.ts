import { Component } from '../core/component';
import { EventHandler } from '../utils/event-handler';

export interface CardOptions {
  rtl?: boolean;
}

export default class Card extends Component {
  private static readonly SELECTORS = {
    CARD: '.cl-card',
    HEADER: '.cl-card-header',
    BODY: '.cl-card-body',
    FOOTER: '.cl-card-footer',
    COLLAPSE_TOGGLE: '[data-cl-toggle="collapse"]',
    DISMISS: '[data-cl-dismiss="card"]'
  };

  private static readonly CLASSES = {
    COLLAPSING: 'cl-collapsing',
    COLLAPSED: 'cl-collapsed',
    SHOW: 'cl-show',
    RTL: 'cl-rtl'
  };

  private readonly options: CardOptions;

  constructor(element: HTMLElement, options: CardOptions = {}) {
    super(element);

    this.options = {
      rtl: false,
      ...options
    };

    this.init();
  }

  private init(): void {
    // Add RTL class if needed
    if (this.options.rtl) {
      this.element.classList.add(Card.CLASSES.RTL);
    }

    // Add event listeners for collapse toggle
    EventHandler.on<'click'>(
      this.element,
      'click',
      Card.SELECTORS.COLLAPSE_TOGGLE,
      (event) => {
        event.preventDefault();
        this.toggleCollapse();
      }
    );

    // Add event listeners for dismiss
    EventHandler.on<'click'>(
      this.element,
      'click',
      Card.SELECTORS.DISMISS,
      (event) => {
        event.preventDefault();
        this.dismiss();
      }
    );

    // Handle direction changes
    document.documentElement.addEventListener('directionchange', (event: Event) => {
      if (event instanceof CustomEvent) {
        const isRTL = event.detail.direction === 'rtl';
        this.element.classList.toggle(Card.CLASSES.RTL, isRTL);
        this.options.rtl = isRTL;
      }
    });
  }

  private toggleCollapse(): void {
    const isCollapsed = this.element.classList.contains(Card.CLASSES.COLLAPSED);
    
    if (isCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }
  }

  private collapse(): void {
    const body = this.element.querySelector(Card.SELECTORS.BODY) as HTMLElement;
    if (!body) return;

    const height = body.offsetHeight;

    // Add collapsing class
    this.element.classList.add(Card.CLASSES.COLLAPSING);
    this.element.classList.add(Card.CLASSES.COLLAPSED);
    body.style.height = `${height}px`;

    // Trigger reflow
    void body.offsetHeight;

    // Collapse
    body.style.height = '0';

    // Handle transition end
    const handleTransitionEnd = () => {
      body.removeEventListener('transitionend', handleTransitionEnd);
      this.element.classList.remove(Card.CLASSES.COLLAPSING);
      body.style.height = '';
    };

    body.addEventListener('transitionend', handleTransitionEnd);

    // Dispatch event
    EventHandler.trigger(this.element, 'cl.card.collapsed');
  }

  private expand(): void {
    const body = this.element.querySelector(Card.SELECTORS.BODY) as HTMLElement;
    if (!body) return;

    // Set initial height
    body.style.height = '0';

    // Add collapsing class
    this.element.classList.add(Card.CLASSES.COLLAPSING);
    this.element.classList.remove(Card.CLASSES.COLLAPSED);

    // Get expanded height
    const height = body.scrollHeight;

    // Trigger reflow
    void body.offsetHeight;

    // Expand
    body.style.height = `${height}px`;

    // Handle transition end
    const handleTransitionEnd = () => {
      body.removeEventListener('transitionend', handleTransitionEnd);
      this.element.classList.remove(Card.CLASSES.COLLAPSING);
      body.style.height = '';
    };

    body.addEventListener('transitionend', handleTransitionEnd);

    // Dispatch event
    EventHandler.trigger(this.element, 'cl.card.expanded');
  }

  private dismiss(): void {
    this.element.classList.remove(Card.CLASSES.SHOW);
    
    const handleTransitionEnd = () => {
      this.element.removeEventListener('transitionend', handleTransitionEnd);
      this.element.remove();
      EventHandler.trigger(this.element, 'cl.card.dismissed');
    };

    this.element.addEventListener('transitionend', handleTransitionEnd);
  }

  public destroy(): void {
    // Remove event listeners
    EventHandler.off(this.element, 'click');
    
    // Remove classes
    this.element.classList.remove(
      Card.CLASSES.RTL,
      Card.CLASSES.COLLAPSED,
      Card.CLASSES.COLLAPSING,
      Card.CLASSES.SHOW
    );
  }
}
