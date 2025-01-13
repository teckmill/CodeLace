/**
 * Base component class that all CodeLace components inherit from.
 * Provides common functionality and type safety for DOM manipulation.
 */
export abstract class Component {
    protected element: HTMLElement;
    protected options: Record<string, any> = {};

    /**
     * Creates a new Component instance
     * @param selector - CSS selector string or HTMLElement
     */
    constructor(selector: string | HTMLElement) {
        if (typeof selector === 'string') {
            const el = document.querySelector(selector);
            if (!el) {
                throw new Error(`Element with selector "${selector}" not found`);
            }
            this.element = el as HTMLElement;
        } else if (selector instanceof HTMLElement) {
            this.element = selector;
        } else {
            throw new Error('Invalid selector type. Must be string or HTMLElement');
        }
    }

    /**
     * Gets the underlying DOM element
     */
    public getElement(): HTMLElement {
        return this.element;
    }

    /**
     * Adds one or more CSS classes to the element
     * @param classes - CSS class names to add
     */
    protected addClass(...classes: string[]): void {
        this.element.classList.add(...classes);
    }

    /**
     * Removes one or more CSS classes from the element
     * @param classes - CSS class names to remove
     */
    protected removeClass(...classes: string[]): void {
        this.element.classList.remove(...classes);
    }

    /**
     * Toggles a CSS class on the element
     * @param className - CSS class name to toggle
     * @param force - If true, adds the class; if false, removes it
     */
    protected toggleClass(className: string, force?: boolean): void {
        this.element.classList.toggle(className, force);
    }

    /**
     * Sets an attribute on the element
     * @param name - Attribute name
     * @param value - Attribute value
     */
    protected setAttribute(name: string, value: string): void {
        this.element.setAttribute(name, value);
    }

    /**
     * Gets an attribute value from the element
     * @param name - Attribute name
     */
    protected getAttribute(name: string): string | null {
        return this.element.getAttribute(name);
    }

    /**
     * Removes an attribute from the element
     * @param name - Attribute name
     */
    protected removeAttribute(name: string): void {
        this.element.removeAttribute(name);
    }

    /**
     * Sets the inner HTML of the element
     * @param html - HTML content
     */
    protected setHTML(html: string): void {
        this.element.innerHTML = html;
    }

    /**
     * Gets the inner HTML of the element
     */
    protected getHTML(): string {
        return this.element.innerHTML;
    }

    /**
     * Sets the text content of the element
     * @param text - Text content
     */
    protected setText(text: string): void {
        this.element.textContent = text;
    }

    /**
     * Gets the text content of the element
     */
    protected getText(): string {
        return this.element.textContent || '';
    }

    /**
     * Adds an event listener to the element
     * @param type - Event type
     * @param listener - Event listener function
     * @param options - Event listener options
     */
    protected addEventListener<K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | AddEventListenerOptions
    ): void {
        this.element.addEventListener(type, listener, options);
    }

    /**
     * Removes an event listener from the element
     * @param type - Event type
     * @param listener - Event listener function
     * @param options - Event listener options
     */
    protected removeEventListener<K extends keyof HTMLElementEventMap>(
        type: K,
        listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
        options?: boolean | EventListenerOptions
    ): void {
        this.element.removeEventListener(type, listener, options);
    }

    /**
     * Dispatches a custom event from the element
     * @param eventName - Name of the event
     * @param detail - Event detail object
     */
    protected dispatchEvent(eventName: string, detail?: any): boolean {
        const event = new CustomEvent(eventName, {
            bubbles: true,
            cancelable: true,
            detail
        });
        return this.element.dispatchEvent(event);
    }

    /**
     * Destroys the component and cleans up event listeners
     */
    public destroy(): void {
        // Override in child classes to clean up resources
    }
}
