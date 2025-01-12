import BaseComponent, { ComponentOptions } from '../base-component';
interface AlertOptions extends ComponentOptions {
    dismissible?: boolean;
    duration?: number;
    onClose?: () => void;
}
export default class Alert extends BaseComponent {
    protected options: AlertOptions;
    private closeButton;
    protected getDefaultOptions(): AlertOptions;
    protected init(): void;
    private setupDismissButton;
    close(): Promise<void>;
    destroy(): void;
}
export {};
