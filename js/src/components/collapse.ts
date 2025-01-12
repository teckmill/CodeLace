import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, hasClass } from '../util';

interface CollapseOptions extends ComponentOptions {
  parent?: string | null;
  toggle?: boolean;
  onShow?: () => void;
  onShown?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

export default class Collapse extends BaseComponent {
  protected declare options: CollapseOptions;
  private isTransitioning = false;
  private isShown = false;
  private parent: HTMLElement | null = null;
  private dimension: 'height' | 'width' = 'height';

  protected getDefaultOptions(): CollapseOptions {
    return {
      ...super.getDefaultOptions(),
      parent: null,
      toggle: true,
      onShow: () => {},
      onShown: () => {},
      onHide: () => {},
      onHidden: () => {}
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;

    addClass(this.element, 'cl-collapse');
    this.element.style.display = 'none';

    // Set initial ARIA attributes
    this.element.setAttribute('aria-expanded', 'false');

    // Find parent if specified
    if (this.options.parent) {
      this.parent = typeof this.options.parent === 'string'
        ? document.querySelector(this.options.parent)
        : this.options.parent;
    }

    // Determine dimension
    this.dimension = this.element.classList.contains('width') ? 'width' : 'height';

    this.bindEvents();
  }

  private bindEvents(): void {
    // Find triggers for this collapse
    const triggers = document.querySelectorAll(`[data-toggle="collapse"][href="#${this.element.id}"],
                                             [data-toggle="collapse"][data-target="#${this.element.id}"]`);

    triggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle();
      });

      // Set ARIA attributes on trigger
      trigger.setAttribute('aria-controls', this.element.id);
      trigger.setAttribute('aria-expanded', 'false');
    });
  }

  private getDimension(): number {
    return this.dimension === 'height'
      ? this.element.scrollHeight
      : this.element.scrollWidth;
  }

  private hideOtherCollapses(): void {
    if (!this.parent) return;

    const otherCollapses = this.parent.querySelectorAll('.cl-collapse.show');
    otherCollapses.forEach(collapse => {
      if (collapse !== this.element) {
        const collapseInstance = BaseComponent.getInstance(collapse);
        if (collapseInstance instanceof Collapse) {
          collapseInstance.hide();
        }
      }
    });
  }

  public async show(): Promise<void> {
    if (this.isShown || this.isTransitioning || !(this.element instanceof HTMLElement)) return;

    this.options.onShow?.();
    this.isTransitioning = true;

    // Hide other collapses if we're in an accordion
    if (this.parent) {
      this.hideOtherCollapses();
    }

    // Set initial styles
    this.element.style.display = 'block';
    this.element.style[this.dimension] = '0px';

    // Force reflow
    this.element.offsetHeight;

    // Add transition class
    addClass(this.element, 'collapsing');
    removeClass(this.element, 'collapse');

    // Set target dimension
    const dimension = this.getDimension();
    this.element.style[this.dimension] = `${dimension}px`;

    // Update ARIA
    this.element.setAttribute('aria-expanded', 'true');
    const triggers = document.querySelectorAll(`[data-toggle="collapse"][href="#${this.element.id}"],
                                             [data-toggle="collapse"][data-target="#${this.element.id}"]`);
    triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'true'));

    // Wait for transition
    await new Promise(resolve => {
      const duration = parseFloat(getComputedStyle(this.element).transitionDuration) * 1000;
      setTimeout(resolve, duration);
    });

    // Clean up
    removeClass(this.element, 'collapsing');
    addClass(this.element, 'collapse', 'show');
    this.element.style[this.dimension] = '';

    this.isTransitioning = false;
    this.isShown = true;
    this.options.onShown?.();
  }

  public async hide(): Promise<void> {
    if (!this.isShown || this.isTransitioning || !(this.element instanceof HTMLElement)) return;

    this.options.onHide?.();
    this.isTransitioning = true;

    // Set current dimension
    const dimension = this.getDimension();
    this.element.style[this.dimension] = `${dimension}px`;

    // Force reflow
    this.element.offsetHeight;

    // Add transition class
    addClass(this.element, 'collapsing');
    removeClass(this.element, 'collapse', 'show');

    // Reset dimension
    this.element.style[this.dimension] = '';

    // Update ARIA
    this.element.setAttribute('aria-expanded', 'false');
    const triggers = document.querySelectorAll(`[data-toggle="collapse"][href="#${this.element.id}"],
                                             [data-toggle="collapse"][data-target="#${this.element.id}"]`);
    triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));

    // Wait for transition
    await new Promise(resolve => {
      const duration = parseFloat(getComputedStyle(this.element).transitionDuration) * 1000;
      setTimeout(resolve, duration);
    });

    // Clean up
    removeClass(this.element, 'collapsing');
    addClass(this.element, 'collapse');
    this.element.style.display = 'none';

    this.isTransitioning = false;
    this.isShown = false;
    this.options.onHidden?.();
  }

  public toggle(): void {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  public destroy(): void {
    const triggers = document.querySelectorAll(`[data-toggle="collapse"][href="#${this.element.id}"],
                                             [data-toggle="collapse"][data-target="#${this.element.id}"]`);
    
    triggers.forEach(trigger => {
      trigger.removeEventListener('click', () => this.toggle());
      trigger.removeAttribute('aria-controls');
      trigger.removeAttribute('aria-expanded');
    });

    if (this.element instanceof HTMLElement) {
      this.element.removeAttribute('aria-expanded');
      removeClass(this.element, 'collapse', 'show', 'collapsing');
      this.element.style[this.dimension] = '';
      this.element.style.display = '';
    }

    super.destroy();
  }
}
