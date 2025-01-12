import BaseComponent, { ComponentOptions } from '../base-component';
interface CollapseOptions extends ComponentOptions {
    parent?: string | null;
    toggle?: boolean;
    onShow?: () => void;
    onShown?: () => void;
    onHide?: () => void;
    onHidden?: () => void;
}
export default class Collapse extends BaseComponent {
    protected options: CollapseOptions;
    private isTransitioning;
    private isShown;
    private parent;
    private dimension;
    protected getDefaultOptions(): CollapseOptions;
    protected init(): void;
    private bindEvents;
    private getDimension;
    private hideOtherCollapses;
    show(): Promise<void>;
    hide(): Promise<void>;
    toggle(): void;
    destroy(): void;
}
export {};
