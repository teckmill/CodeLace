/**
 * Check if a value is an Element
 */
export function isElement(value: unknown): value is Element {
  return value instanceof Element;
}

/**
 * Get a single element that matches the selector
 */
export function getElement<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): T | null {
  return parent.querySelector<T>(selector);
}

/**
 * Get all elements that match the selector
 */
export function getElements<T extends Element = Element>(
  selector: string,
  parent: ParentNode = document
): NodeListOf<T> {
  return parent.querySelectorAll<T>(selector);
}

/**
 * Create an element with the given attributes
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  attributes: Record<string, string> = {}
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

/**
 * Insert an element after a reference element
 */
export function insertAfter(newNode: Node, referenceNode: Node): void {
  if (referenceNode.parentNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
  }
}

/**
 * Remove an element from the DOM
 */
export function removeElement(element: Element): void {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
}

/**
 * Check if an element matches a selector
 */
export function matches(element: Element, selector: string): boolean {
  return element.matches(selector);
}

/**
 * Find the closest ancestor that matches the selector
 */
export function closest(element: Element, selector: string): Element | null {
  return element.closest(selector);
}

/**
 * Get computed style value for an element
 */
export function getStyle(element: Element, property: string): string {
  return window.getComputedStyle(element).getPropertyValue(property);
}

/**
 * Set inline style on an element
 */
export function setStyle(element: Element, property: string, value: string): void {
  (element as HTMLElement).style.setProperty(property, value);
}

/**
 * Get element dimensions
 */
export function getDimensions(element: Element): DOMRect {
  return element.getBoundingClientRect();
}

/**
 * Check if an element is visible
 */
export function isVisible(element: Element): boolean {
  return !!(
    (element as HTMLElement).offsetWidth ||
    (element as HTMLElement).offsetHeight ||
    element.getClientRects().length
  );
}

/**
 * Trigger element reflow
 */
export function reflow(element: Element): void {
  void (element as HTMLElement).offsetHeight;
}
