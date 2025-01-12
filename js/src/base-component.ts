export interface ComponentOptions {
  element: Element | string;
  [key: string]: any;
}

export default class BaseComponent {
  protected element: Element;
  protected options: ComponentOptions;

  constructor(options: ComponentOptions) {
    this.element = typeof options.element === 'string'
      ? document.querySelector(options.element) || document.body
      : options.element;
    this.options = { ...this.getDefaultOptions(), ...options };
    this.init();
  }

  protected getDefaultOptions(): ComponentOptions {
    return {
      element: document.body
    };
  }

  protected init(): void {
    // Initialize component
    this.setupEventListeners();
  }

  protected setupEventListeners(): void {
    // Setup event listeners
  }

  public destroy(): void {
    // Cleanup
  }
}
