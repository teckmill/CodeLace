import BaseComponent, { ComponentOptions } from '../base-component';
interface ButtonOptions extends ComponentOptions {
    loading?: boolean;
    disabled?: boolean;
    onClick?: (event: MouseEvent) => void;
}
export default class Button extends BaseComponent {
    protected options: ButtonOptions;
    private originalContent;
    protected getDefaultOptions(): ButtonOptions;
    protected init(): void;
    setLoading(loading: boolean): void;
    setDisabled(disabled: boolean): void;
    destroy(): void;
}
export {};
