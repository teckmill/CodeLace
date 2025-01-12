import { matches } from './dom';

type EventMap = {
  click: MouseEvent;
  keydown: KeyboardEvent;
  keyup: KeyboardEvent;
  keypress: KeyboardEvent;
  mouseover: MouseEvent;
  mouseout: MouseEvent;
  focus: FocusEvent;
  blur: FocusEvent;
  [key: string]: Event;
};

type EventType = keyof EventMap;
type EventCallback<T extends EventType> = (event: EventMap[T]) => void;

interface EventHandlerData<T extends EventType> {
  element: Element;
  eventType: T;
  handler: EventCallback<T>;
  delegateSelector?: string;
  originalHandler: EventListener;
}

/**
 * Event handler utility for managing DOM events
 */
export class EventHandler {
  private static handlers: EventHandlerData<any>[] = [];

  /**
   * Attach an event handler to an element
   */
  public static on<T extends EventType>(
    element: Element,
    eventType: T,
    delegateSelector: string | EventCallback<T>,
    handler?: EventCallback<T>
  ): void {
    const isDelegated = typeof delegateSelector === 'string';
    const callback = isDelegated ? handler! : delegateSelector as EventCallback<T>;
    const selector = isDelegated ? delegateSelector as string : undefined;

    const originalHandler = ((event: Event) => {
      if (!isDelegated) {
        callback(event as EventMap[T]);
        return;
      }

      const target = event.target as Element;
      if (!target) return;

      const delegateTarget = target.closest(selector!);
      if (delegateTarget && element.contains(delegateTarget)) {
        callback.call(delegateTarget, event as EventMap[T]);
      }
    }) as EventListener;

    element.addEventListener(eventType, originalHandler);

    this.handlers.push({
      element,
      eventType,
      handler: callback,
      delegateSelector: selector,
      originalHandler
    });
  }

  /**
   * Remove an event handler from an element
   */
  public static off<T extends EventType>(
    element: Element,
    eventType: T,
    delegateSelector?: string | EventCallback<T>,
    handler?: EventCallback<T>
  ): void {
    const handlers = this.handlers.filter(h => {
      const matchesElement = h.element === element;
      const matchesEvent = h.eventType === eventType;
      const matchesDelegate = delegateSelector
        ? typeof delegateSelector === 'string'
          ? h.delegateSelector === delegateSelector
          : h.handler === delegateSelector
        : true;
      const matchesHandler = handler ? h.handler === handler : true;

      return matchesElement && matchesEvent && matchesDelegate && matchesHandler;
    });

    handlers.forEach(h => {
      h.element.removeEventListener(h.eventType, h.originalHandler);
      const index = this.handlers.indexOf(h);
      if (index > -1) {
        this.handlers.splice(index, 1);
      }
    });
  }

  /**
   * Trigger an event on an element
   */
  public static trigger<T extends EventType>(
    element: Element,
    eventType: T,
    detail?: any
  ): void {
    const event = new CustomEvent(eventType, {
      bubbles: true,
      cancelable: true,
      detail
    });

    element.dispatchEvent(event);
  }

  /**
   * Remove all event handlers
   */
  public static removeAll(): void {
    this.handlers.forEach(h => {
      h.element.removeEventListener(h.eventType, h.originalHandler);
    });
    this.handlers = [];
  }
}
