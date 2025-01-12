type EventMap = {
    click: MouseEvent;
    keydown: KeyboardEvent;
    keyup: KeyboardEvent;
    keypress: KeyboardEvent;
    mouseover: MouseEvent;
    mouseout: MouseEvent;
    focus: FocusEvent;
    blur: FocusEvent;
    transitionend: TransitionEvent;
    [key: string]: Event;
};
type EventType = keyof EventMap;
type EventCallback<T extends EventType> = (event: EventMap[T]) => void;
/**
 * Event handler utility for managing DOM events
 */
export declare class EventHandler {
    private static handlers;
    /**
     * Attach an event handler to an element
     */
    static on<T extends EventType>(element: Element, eventType: T, delegateSelector: string | EventCallback<T>, handler?: EventCallback<T>): void;
    /**
     * Remove an event handler from an element
     */
    static off<T extends EventType>(element: Element, eventType: T, delegateSelector?: string | EventCallback<T>, handler?: EventCallback<T>): void;
    /**
     * Trigger an event on an element
     */
    static trigger<T extends EventType>(element: Element, eventType: T, detail?: any): void;
    /**
     * Remove all event handlers
     */
    static removeAll(): void;
}
export {};
