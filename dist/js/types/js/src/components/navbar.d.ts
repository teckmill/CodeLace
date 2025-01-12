import { Component } from '../core/component';
export interface NavbarOptions {
    rtl?: boolean;
    breakpoint?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    sticky?: boolean;
    fixed?: 'top' | 'bottom' | null;
}
export default class Navbar extends Component {
    private static readonly SELECTORS;
    private static readonly CLASSES;
    private readonly options;
    private collapse;
    constructor(element: HTMLElement, options?: NavbarOptions);
    private init;
    private toggleCollapse;
    private openCollapse;
    private closeCollapse;
    private toggleDropdown;
    private closeAllDropdowns;
    destroy(): void;
}
