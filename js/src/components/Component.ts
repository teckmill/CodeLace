export abstract class Component {
    protected element: HTMLElement;

    constructor(selector: string | HTMLElement) {
        if (typeof selector === 'string') {
            const el = document.querySelector(selector);
            if (!el) {
                throw new Error(`Element with selector "${selector}" not found`);
            }
            this.element = el as HTMLElement;
        } else {
            this.element = selector;
        }
    }

    protected emit<T = any>(eventName: string, detail?: T) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        this.element.dispatchEvent(event);
    }

    protected querySelector<T extends HTMLElement>(selector: string): T {
        const element = this.element.querySelector<T>(selector);
        if (!element) {
            throw new Error(`Element with selector "${selector}" not found`);
        }
        return element;
    }

    protected querySelectorAll<T extends HTMLElement>(selector: string): NodeListOf<T> {
        return this.element.querySelectorAll<T>(selector);
    }

    protected addClass(className: string) {
        this.element.classList.add(className);
    }

    protected removeClass(className: string) {
        this.element.classList.remove(className);
    }

    protected toggleClass(className: string, force?: boolean) {
        this.element.classList.toggle(className, force);
    }

    protected hasClass(className: string): boolean {
        return this.element.classList.contains(className);
    }

    protected setStyle(property: string, value: string) {
        this.element.style.setProperty(property, value);
    }

    protected getStyle(property: string): string {
        return getComputedStyle(this.element).getPropertyValue(property);
    }

    protected setData(key: string, value: string) {
        this.element.dataset[key] = value;
    }

    protected getData(key: string): string | undefined {
        return this.element.dataset[key];
    }

    protected setAttributes(attributes: Record<string, string>) {
        Object.entries(attributes).forEach(([key, value]) => {
            this.element.setAttribute(key, value);
        });
    }

    protected getAttributes(attributes: string[]): Record<string, string> {
        return attributes.reduce((acc, attr) => {
            acc[attr] = this.element.getAttribute(attr) || '';
            return acc;
        }, {} as Record<string, string>);
    }

    protected on<K extends keyof HTMLElementEventMap>(
        event: K,
        handler: (event: HTMLElementEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions
    ) {
        this.element.addEventListener(event, handler, options);
    }

    protected off<K extends keyof HTMLElementEventMap>(
        event: K,
        handler: (event: HTMLElementEventMap[K]) => void,
        options?: boolean | EventListenerOptions
    ) {
        this.element.removeEventListener(event, handler, options);
    }

    protected trigger(eventName: string, detail?: any) {
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            cancelable: true
        });
        this.element.dispatchEvent(event);
    }
}
