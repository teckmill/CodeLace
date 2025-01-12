/**
 * Check if a value is an Element
 */
export declare function isElement(value: unknown): value is Element;
/**
 * Get a single element that matches the selector
 */
export declare function getElement<T extends Element = Element>(selector: string, parent?: ParentNode): T | null;
/**
 * Get all elements that match the selector
 */
export declare function getElements<T extends Element = Element>(selector: string, parent?: ParentNode): NodeListOf<T>;
/**
 * Create an element with the given attributes
 */
export declare function createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, attributes?: Record<string, string>): HTMLElementTagNameMap[K];
/**
 * Insert an element after a reference element
 */
export declare function insertAfter(newNode: Node, referenceNode: Node): void;
/**
 * Remove an element from the DOM
 */
export declare function removeElement(element: Element): void;
/**
 * Check if an element matches a selector
 */
export declare function matches(element: Element, selector: string): boolean;
/**
 * Find the closest ancestor that matches the selector
 */
export declare function closest(element: Element, selector: string): Element | null;
/**
 * Get computed style value for an element
 */
export declare function getStyle(element: Element, property: string): string;
/**
 * Set inline style on an element
 */
export declare function setStyle(element: Element, property: string, value: string): void;
/**
 * Get element dimensions
 */
export declare function getDimensions(element: Element): DOMRect;
/**
 * Check if an element is visible
 */
export declare function isVisible(element: Element): boolean;
/**
 * Trigger element reflow
 */
export declare function reflow(element: Element): void;
