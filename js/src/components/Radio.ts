import { Component } from '../core/component';

interface RadioOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface RadioOptions {
    name: string;
    inline?: boolean;
    disabled?: boolean;
    required?: boolean;
    defaultValue?: string;
}

export class Radio extends Component {
    protected options: RadioOptions;
    private items: RadioOption[] = [];
    private selectedValue: string | null = null;

    constructor(selector: string, items: RadioOption[], options: RadioOptions) {
        super(selector);
        this.items = items;
        this.options = {
            inline: false,
            disabled: false,
            required: false,
            ...options
        };
        this.selectedValue = options.defaultValue || null;
        this.init();
    }

    private init(): void {
        this.element.classList.add('cl-radio-group');
        if (this.options.inline) {
            this.element.classList.add('cl-radio-inline');
        }
        if (this.options.disabled) {
            this.element.classList.add('cl-radio-disabled');
        }
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        this.element.innerHTML = this.items.map(item => `
            <label class="cl-radio ${item.disabled || this.options.disabled ? 'disabled' : ''}">
                <input type="radio"
                       name="${this.options.name}"
                       value="${item.value}"
                       ${this.selectedValue === item.value ? 'checked' : ''}
                       ${item.disabled || this.options.disabled ? 'disabled' : ''}
                       ${this.options.required ? 'required' : ''}>
                <span class="cl-radio-mark"></span>
                <span class="cl-radio-label">${item.label}</span>
            </label>
        `).join('');
    }

    private attachEventListeners(): void {
        this.element.addEventListener('change', (e) => {
            const input = e.target as HTMLInputElement;
            if (input.type === 'radio') {
                this.selectedValue = input.value;
                this.dispatchEvent('change', { value: this.selectedValue });
            }
        });
    }

    // Public API
    public getValue(): string | null {
        return this.selectedValue;
    }

    public setValue(value: string): void {
        const item = this.items.find(item => item.value === value);
        if (item && !item.disabled && !this.options.disabled) {
            this.selectedValue = value;
            this.render();
            this.dispatchEvent('change', { value });
        }
    }

    public disable(): void {
        this.options.disabled = true;
        this.element.classList.add('cl-radio-disabled');
        this.render();
    }

    public enable(): void {
        this.options.disabled = false;
        this.element.classList.remove('cl-radio-disabled');
        this.render();
    }

    public addOption(option: RadioOption): void {
        this.items.push(option);
        this.render();
    }

    public removeOption(value: string): void {
        const index = this.items.findIndex(item => item.value === value);
        if (index !== -1) {
            if (this.selectedValue === value) {
                this.selectedValue = null;
            }
            this.items.splice(index, 1);
            this.render();
        }
    }
}
