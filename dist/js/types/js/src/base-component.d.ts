export interface ComponentOptions {
    element: Element | string;
    [key: string]: any;
}
export default class BaseComponent {
    protected element: Element;
    protected options: ComponentOptions;
    private static instances;
    constructor(options: ComponentOptions);
    protected getDefaultOptions(): ComponentOptions;
    protected init(): void;
    protected setupEventListeners(): void;
    destroy(): void;
    static getInstance(element: Element): BaseComponent | undefined;
}
