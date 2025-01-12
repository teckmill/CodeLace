// DOM manipulation
export const getElement = (selector: string | Element): Element | null => {
  return typeof selector === 'string'
    ? document.querySelector(selector)
    : selector;
};

export const getAllElements = (selector: string): Element[] => {
  return Array.from(document.querySelectorAll(selector));
};

// Event handling
export const on = (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
): void => {
  element.addEventListener(event, handler, options);
};

export const off = (
  element: Element,
  event: string,
  handler: EventListenerOrEventListenerObject,
  options?: EventListenerOptions
): void => {
  element.removeEventListener(event, handler, options);
};

// Class manipulation
export const hasClass = (element: Element, className: string): boolean => {
  return element.classList.contains(className);
};

export const addClass = (element: Element, ...classNames: string[]): void => {
  element.classList.add(...classNames);
};

export const removeClass = (element: Element, ...classNames: string[]): void => {
  element.classList.remove(...classNames);
};

export const toggleClass = (
  element: Element,
  className: string,
  force?: boolean
): void => {
  element.classList.toggle(className, force);
};

// Animation
export const fadeIn = (
  element: Element,
  duration = 300,
  display = 'block'
): Promise<void> => {
  return new Promise((resolve) => {
    element.style.opacity = '0';
    element.style.display = display;

    const start = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = elapsed / duration;

      element.style.opacity = Math.min(progress, 1).toString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
};

export const fadeOut = (element: Element, duration = 300): Promise<void> => {
  return new Promise((resolve) => {
    const start = performance.now();
    const initialOpacity = parseFloat(getComputedStyle(element).opacity);

    const animate = (currentTime: number) => {
      const elapsed = currentTime - start;
      const progress = elapsed / duration;

      element.style.opacity = Math.max(initialOpacity - progress, 0).toString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
        resolve();
      }
    };

    requestAnimationFrame(animate);
  });
};
