/**
 * Base component class that all CodeLace components extend from
 */
export declare abstract class Component {
    protected element: HTMLElement;
    constructor(element: HTMLElement);
    /**
     * Get the DOM element associated with this component
     */
    getElement(): HTMLElement;
    /**
     * Cleanup any resources used by this component
     */
    abstract destroy(): void;
}
