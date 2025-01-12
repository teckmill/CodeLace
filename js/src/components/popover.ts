import BaseComponent, { ComponentOptions } from '../base-component';
import { addClass, removeClass, fadeIn, fadeOut } from '../util';
import { computePosition, flip, shift, offset, arrow, Placement } from '@floating-ui/dom';

type AllowedAttribute = string | RegExp;

interface PopoverOptions extends ComponentOptions {
  content: string | HTMLElement | (() => string | HTMLElement);
  title?: string;
  placement?: Placement;
  trigger?: 'click' | 'hover' | 'focus' | 'manual';
  animation?: boolean;
  html?: boolean;
  delay?: number | { show: number; hide: number };
  container?: string | HTMLElement;
  boundary?: HTMLElement;
  offset?: number;
  fallbackPlacements?: Placement[];
  template?: string;
  customClass?: string;
  sanitize?: boolean;
  sanitizeFn?: (content: string) => string;
  allowList?: { [key: string]: AllowedAttribute[] };
  popperConfig?: any;
  onShow?: () => void;
  onShown?: () => void;
  onHide?: () => void;
  onHidden?: () => void;
}

export default class Popover extends BaseComponent {
  protected declare options: PopoverOptions;
  private tip: HTMLElement | null = null;
  private arrow: HTMLElement | null = null;
  private timeout: number | null = null;
  private isShown = false;
  private hoverState: 'in' | 'out' | null = null;
  private activeTrigger: { click: boolean; hover: boolean; focus: boolean } = {
    click: false,
    hover: false,
    focus: false
  };

  protected getDefaultOptions(): PopoverOptions {
    return {
      ...super.getDefaultOptions(),
      content: '',
      placement: 'top',
      trigger: 'click',
      animation: true,
      html: false,
      delay: 0,
      container: 'body',
      sanitize: true,
      offset: 8,
      fallbackPlacements: ['top', 'right', 'bottom', 'left'],
      template: `
        <div class="cl-popover" role="tooltip">
          <div class="cl-popover-arrow"></div>
          <h3 class="cl-popover-header"></h3>
          <div class="cl-popover-body"></div>
        </div>
      `,
      allowList: {
        '*': ['class', 'dir', 'id', 'lang', 'role', /^aria-[\w-]*$/i] as AllowedAttribute[],
        a: ['target', 'href', 'title', 'rel'],
        area: [],
        b: [],
        br: [],
        col: [],
        code: [],
        div: [],
        em: [],
        hr: [],
        h1: [],
        h2: [],
        h3: [],
        h4: [],
        h5: [],
        h6: [],
        i: [],
        img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
        li: [],
        ol: [],
        p: [],
        pre: [],
        s: [],
        small: [],
        span: [],
        sub: [],
        sup: [],
        strong: [],
        u: [],
        ul: []
      }
    };
  }

  protected init(): void {
    if (!(this.element instanceof HTMLElement)) return;

    // Set ARIA attributes
    this.element.setAttribute('aria-describedby', `popover-${this.generateId()}`);

    this.bindEvents();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }

  private bindEvents(): void {
    if (!(this.element instanceof HTMLElement)) return;

    const triggers = this.options.trigger?.split(' ') || [];

    triggers.forEach(trigger => {
      switch (trigger) {
        case 'click':
          this.element.addEventListener('click', () => this.toggle());
          break;

        case 'hover':
          this.element.addEventListener('mouseenter', () => {
            this.hoverState = 'in';
            this.enter();
          });
          this.element.addEventListener('mouseleave', () => {
            this.hoverState = 'out';
            this.leave();
          });
          break;

        case 'focus':
          this.element.addEventListener('focus', () => this.enter());
          this.element.addEventListener('blur', () => this.leave());
          break;
      }
    });
  }

  private createTip(): HTMLElement {
    const template = document.createElement('div');
    template.innerHTML = this.options.template!.trim();
    this.tip = template.firstElementChild as HTMLElement;
    
    if (this.options.customClass) {
      addClass(this.tip, this.options.customClass);
    }

    this.arrow = this.tip.querySelector('.cl-popover-arrow');
    return this.tip;
  }

  private setContent(): void {
    if (!this.tip) return;

    const title = this.options.title;
    const content = this.getContent();

    // Set title
    const header = this.tip.querySelector('.cl-popover-header');
    if (header) {
      if (title) {
        header.innerHTML = this.sanitize(title);
      } else {
        header.remove();
      }
    }

    // Set content
    const body = this.tip.querySelector('.cl-popover-body');
    if (body) {
      if (this.options.html && content instanceof HTMLElement) {
        body.innerHTML = '';
        body.appendChild(content);
      } else {
        body.innerHTML = this.sanitize(content.toString());
      }
    }
  }

  private getContent(): string | HTMLElement {
    const content = this.options.content;
    return typeof content === 'function' ? content() : content;
  }

  private sanitize(content: string): string {
    if (!this.options.sanitize) return content;
    return this.options.sanitizeFn
      ? this.options.sanitizeFn(content)
      : this.defaultSanitize(content);
  }

  private defaultSanitize(content: string): string {
    const div = document.createElement('div');
    div.innerHTML = content;
    this.sanitizeNode(div);
    return div.innerHTML;
  }

  private sanitizeNode(node: Node): void {
    const allowList = this.options.allowList!;

    // Remove unwanted nodes
    Array.from(node.childNodes).forEach(child => {
      if (child instanceof HTMLElement) {
        const tagName = child.tagName.toLowerCase();
        
        // Remove if tag is not in allowList
        if (!allowList[tagName]) {
          child.remove();
          return;
        }

        // Remove unwanted attributes
        Array.from(child.attributes).forEach(attr => {
          const isAllowed = allowList[tagName].some(allowed => {
            if (allowed instanceof RegExp) {
              return allowed.test(attr.name);
            }
            return attr.name === allowed;
          });

          if (!isAllowed) {
            child.removeAttribute(attr.name);
          }
        });

        // Recursively sanitize children
        this.sanitizeNode(child);
      }
    });
  }

  private async updatePosition(): Promise<void> {
    if (!this.tip || !(this.element instanceof HTMLElement)) return;

    const { x, y, placement, middlewareData } = await computePosition(
      this.element,
      this.tip,
      {
        placement: this.options.placement,
        middleware: [
          offset(this.options.offset),
          flip({
            fallbackPlacements: this.options.fallbackPlacements
          }),
          shift({ padding: 8 }),
          arrow({ element: this.arrow! })
        ],
        ...this.options.popperConfig
      }
    );

    Object.assign(this.tip.style, {
      left: `${x}px`,
      top: `${y}px`
    });

    // Position arrow
    if (this.arrow && middlewareData.arrow) {
      const { x: arrowX, y: arrowY } = middlewareData.arrow;

      const staticSides: { [key: string]: string } = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right'
      };

      const staticSide = staticSides[placement.split('-')[0]];

      Object.assign(this.arrow.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        [staticSide]: '-4px'
      });
    }
  }

  private enter(): void {
    if (this.isShown || this.timeout) return;

    const delay = typeof this.options.delay === 'number'
      ? this.options.delay
      : (this.options.delay as { show: number })?.show || 0;

    this.timeout = window.setTimeout(() => {
      this.timeout = null;
      if (this.hoverState === 'in') {
        this.show();
      }
    }, delay);
  }

  private leave(): void {
    if (!this.isShown || this.timeout) return;

    const delay = typeof this.options.delay === 'number'
      ? this.options.delay
      : (this.options.delay as { hide: number })?.hide || 0;

    this.timeout = window.setTimeout(() => {
      this.timeout = null;
      if (this.hoverState === 'out') {
        this.hide();
      }
    }, delay);
  }

  public async show(): Promise<void> {
    if (this.isShown) return;

    this.options.onShow?.();
    this.isShown = true;

    // Create tip if it doesn't exist
    if (!this.tip) {
      this.tip = this.createTip();
      document.body.appendChild(this.tip);
    }

    // Set content
    this.setContent();

    // Position popover
    await this.updatePosition();

    // Show popover
    if (this.options.animation) {
      await fadeIn(this.tip);
    } else {
      this.tip.style.display = 'block';
    }

    this.options.onShown?.();
  }

  public async hide(): Promise<void> {
    if (!this.isShown || !this.tip) return;

    this.options.onHide?.();

    if (this.options.animation) {
      await fadeOut(this.tip);
    } else {
      this.tip.style.display = 'none';
    }

    this.isShown = false;
    this.options.onHidden?.();
  }

  public toggle(): void {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  }

  public updateContent(content: string | HTMLElement): void {
    this.options.content = content;
    if (this.tip) {
      this.setContent();
      this.updatePosition();
    }
  }

  public destroy(): void {
    if (this.tip) {
      this.tip.remove();
    }

    if (this.timeout) {
      clearTimeout(this.timeout);
    }

    // Remove event listeners
    if (this.element instanceof HTMLElement) {
      this.element.removeEventListener('click', () => this.toggle());
      this.element.removeEventListener('mouseenter', () => this.enter());
      this.element.removeEventListener('mouseleave', () => this.leave());
      this.element.removeEventListener('focus', () => this.enter());
      this.element.removeEventListener('blur', () => this.leave());
      this.element.removeAttribute('aria-describedby');
    }

    super.destroy();
  }
}
