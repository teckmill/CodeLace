import { Component } from '../core/component';
export interface ModalOptions {
    keyboard?: boolean;
    backdrop?: boolean | 'static';
    focus?: boolean;
    rtl?: boolean;
}
export default class Modal extends Component {
    private static readonly SELECTORS;
    private static readonly CLASSES;
    private readonly options;
    private dialog;
    private backdrop;
    private isShown;
    private isTransitioning;
    private ignoreBackdropClick;
    private isBodyOverflowing;
    private originalBodyPadding;
    private scrollbarWidth;
    constructor(element: HTMLElement, options?: ModalOptions);
    private init;
    private createModalStructure;
    private adjustDialog;
    private setScrollbar;
    private resetScrollbar;
    private createBackdrop;
    private removeBackdrop;
    show(): void;
    hide(): void;
    private hideModal;
    private awaitTransition;
    private isAnimated;
    destroy(): void;
}
