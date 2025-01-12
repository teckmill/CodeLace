import { Component } from '../core/component';
export interface DropdownOptions {
    rtl?: boolean;
    placement?: 'top' | 'bottom' | 'start' | 'end';
    offset?: [number, number];
    reference?: 'toggle' | 'parent';
}
export default class Dropdown extends Component {
    private static readonly SELECTORS;
    private static readonly CLASSES;
    private readonly options;
    private menu;
    private isOpen;
    constructor(element: HTMLElement, options?: DropdownOptions);
    private init;
    private getPlacementClass;
    private updatePlacement;
    private handleKeyDown;
    private focusNextItem;
    private focusPreviousItem;
    private show;
    private hide;
    private toggle;
    destroy(): void;
}
