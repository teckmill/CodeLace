import BaseComponent, { ComponentOptions } from '../base-component';
import { Placement } from '@floating-ui/dom';
type AllowedAttribute = string | RegExp;
interface PopoverOptions extends ComponentOptions {
    content: string | HTMLElement | (() => string | HTMLElement);
    title?: string;
    placement?: Placement;
    trigger?: 'click' | 'hover' | 'focus' | 'manual';
    animation?: boolean;
    html?: boolean;
    delay?: number | {
        show: number;
        hide: number;
    };
    container?: string | HTMLElement;
    boundary?: HTMLElement;
    offset?: number;
    fallbackPlacements?: Placement[];
    template?: string;
    customClass?: string;
    sanitize?: boolean;
    sanitizeFn?: (content: string) => string;
    allowList?: {
        [key: string]: AllowedAttribute[];
    };
    popperConfig?: any;
    onShow?: () => void;
    onShown?: () => void;
    onHide?: () => void;
    onHidden?: () => void;
}
export default class Popover extends BaseComponent {
    protected options: PopoverOptions;
    private tip;
    private arrow;
    private timeout;
    private isShown;
    private hoverState;
    private activeTrigger;
    protected getDefaultOptions(): PopoverOptions;
    protected init(): void;
    private generateId;
    private bindEvents;
    private createTip;
    private setContent;
    private getContent;
    private sanitize;
    private defaultSanitize;
    private sanitizeNode;
    private updatePosition;
    private enter;
    private leave;
    show(): Promise<void>;
    hide(): Promise<void>;
    toggle(): void;
    updateContent(content: string | HTMLElement): void;
    destroy(): void;
}
export {};
