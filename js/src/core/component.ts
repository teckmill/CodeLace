/**
 * Base component class that all CodeLace components extend from
 */
export abstract class Component {
  protected element: HTMLElement;

  constructor(element: HTMLElement) {
    this.element = element;
  }

  /**
   * Get the DOM element associated with this component
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * Cleanup any resources used by this component
   */
  public abstract destroy(): void;
}
