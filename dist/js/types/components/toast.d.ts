import BaseComponent, { ComponentOptions } from '../base-component';
interface ToastOptions extends ComponentOptions {
    autohide?: boolean;
    delay?: number;
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
    animation?: boolean;
    onShow?: () => void;
    onShown?: () => void;
    onHide?: () => void;
    onHidden?: () => void;
}
export default class Toast extends BaseComponent {
    protected options: ToastOptions;
    private container;
    private hideTimeout;
    private isShown;
    protected getDefaultOptions(): ToastOptions;
    protected init(): void;
    private createContainer;
    private setupCloseButton;
    private bindEvents;
    private startHideTimer;
    private clearHideTimer;
    pause(): void;
    resume(): void;
    show(): Promise<void>;
    hide(): Promise<void>;
    destroy(): void;
}
export {};
