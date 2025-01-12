import { Component } from '../core/component';
export interface CardOptions {
    rtl?: boolean;
}
export default class Card extends Component {
    private static readonly SELECTORS;
    private static readonly CLASSES;
    private readonly options;
    constructor(element: HTMLElement, options?: CardOptions);
    private init;
    private toggleCollapse;
    private collapse;
    private expand;
    private dismiss;
    destroy(): void;
}
