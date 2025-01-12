import { Component } from '../core/component';

interface SwitchOptions {
    checked?: boolean;
    disabled?: boolean;
    size?: 'small' | 'medium' | 'large';
    color?: string;
    label?: string;
    labelPosition?: 'left' | 'right';
    loading?: boolean;
}

export class Switch extends Component {
    protected options: SwitchOptions;
    private isChecked: boolean;

    constructor(selector: string, options: SwitchOptions = {}) {
        super(selector);
        this.options = {
            checked: false,
            disabled: false,
            size: 'medium',
            labelPosition: 'right',
            loading: false,
            ...options
        };
        this.isChecked = this.options.checked || false;
        this.init();
    }

    private init(): void {
        this.element.classList.add('cl-switch');
        this.element.classList.add(`cl-switch-${this.options.size}`);
        if (this.options.disabled) {
            this.element.classList.add('cl-switch-disabled');
        }
        if (this.options.loading) {
            this.element.classList.add('cl-switch-loading');
        }
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        const labelContent = this.options.label ? `
            <span class="cl-switch-label">
                ${this.options.label}
            </span>
        ` : '';

        this.element.innerHTML = `
            ${this.options.labelPosition === 'left' ? labelContent : ''}
            <label class="cl-switch-toggle">
                <input type="checkbox"
                       ${this.isChecked ? 'checked' : ''}
                       ${this.options.disabled ? 'disabled' : ''}>
                <span class="cl-switch-track">
                    <span class="cl-switch-thumb">
                        ${this.options.loading ? '<span class="cl-switch-loading-spinner"></span>' : ''}
                    </span>
                </span>
            </label>
            ${this.options.labelPosition === 'right' ? labelContent : ''}
        `;

        if (this.options.color) {
            const track = this.element.querySelector('.cl-switch-track') as HTMLElement;
            if (track) {
                track.style.setProperty('--cl-switch-color', this.options.color);
            }
        }
    }

    private attachEventListeners(): void {
        const input = this.element.querySelector('input[type="checkbox"]');
        if (!input) return;

        input.addEventListener('change', (e) => {
            if (this.options.loading || this.options.disabled) return;
            
            const checkbox = e.target as HTMLInputElement;
            this.isChecked = checkbox.checked;
            this.dispatchEvent('change', { checked: this.isChecked });
        });

        // Make the whole component clickable
        this.element.addEventListener('click', (e) => {
            if (this.options.loading || this.options.disabled) return;
            if (e.target === input) return; // Avoid double triggering

            this.toggle();
        });

        // Keyboard accessibility
        this.element.addEventListener('keydown', (e) => {
            if (this.options.loading || this.options.disabled) return;
            if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    // Public API
    public isOn(): boolean {
        return this.isChecked;
    }

    public toggle(): void {
        if (this.options.loading || this.options.disabled) return;
        this.isChecked = !this.isChecked;
        const input = this.element.querySelector('input[type="checkbox"]') as HTMLInputElement;
        if (input) {
            input.checked = this.isChecked;
        }
        this.dispatchEvent('change', { checked: this.isChecked });
    }

    public check(): void {
        if (!this.isChecked) {
            this.toggle();
        }
    }

    public uncheck(): void {
        if (this.isChecked) {
            this.toggle();
        }
    }

    public disable(): void {
        this.options.disabled = true;
        this.element.classList.add('cl-switch-disabled');
        this.render();
    }

    public enable(): void {
        this.options.disabled = false;
        this.element.classList.remove('cl-switch-disabled');
        this.render();
    }

    public setLoading(loading: boolean): void {
        this.options.loading = loading;
        this.element.classList.toggle('cl-switch-loading', loading);
        this.render();
    }

    public setLabel(label: string): void {
        this.options.label = label;
        this.render();
    }

    public setColor(color: string): void {
        this.options.color = color;
        this.render();
    }
}
