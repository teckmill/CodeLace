import { Component } from '../core/component';
export interface TabOptions {
    activeTab?: string;
    rtl?: boolean;
}
export declare class Tab extends Component {
    private static readonly DATA_TOGGLE;
    private static readonly DATA_TARGET;
    private static readonly ACTIVE_CLASS;
    private static readonly FADE_CLASS;
    private static readonly SHOW_CLASS;
    private readonly options;
    private readonly tabs;
    private readonly panes;
    private activeTab;
    constructor(element: HTMLElement, options?: TabOptions);
    private init;
    private activate;
    private deactivate;
    private getNextTab;
    private getPreviousTab;
    destroy(): void;
}
