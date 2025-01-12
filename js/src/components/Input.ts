import { Component } from '../core/component';

interface InputValidation {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: string) => boolean | string;
}

interface InputOptions {
    type?: 'text' | 'password' | 'email' | 'number' | 'tel' | 'url' | 'search';
    placeholder?: string;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    readonly?: boolean;
    size?: 'small' | 'medium' | 'large';
    validation?: InputValidation;
    icon?: string;
    iconPosition?: 'left' | 'right';
    clearable?: boolean;
    autocomplete?: string;
}

export class Input extends Component {
    protected options: InputOptions;
    private value: string = '';
    private error: string | null = null;
    private isDirty: boolean = false;

    constructor(selector: string, options: InputOptions = {}) {
        super(selector);
        this.options = {
            type: 'text',
            size: 'medium',
            iconPosition: 'left',
            clearable: false,
            ...options
        };
        this.init();
    }

    private init(): void {
        this.element.classList.add('cl-input-wrapper');
        this.element.classList.add(`cl-input-${this.options.size}`);
        if (this.options.disabled) {
            this.element.classList.add('cl-input-disabled');
        }
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        const hasIcon = Boolean(this.options.icon);
        const showClear = this.options.clearable && this.value && !this.options.disabled && !this.options.readonly;

        this.element.innerHTML = `
            ${this.options.label ? `
                <label class="cl-input-label">
                    ${this.options.label}
                    ${this.options.validation?.required ? '<span class="cl-input-required">*</span>' : ''}
                </label>
            ` : ''}
            <div class="cl-input-container ${hasIcon ? `has-icon-${this.options.iconPosition}` : ''}">
                ${hasIcon && this.options.iconPosition === 'left' ? `
                    <span class="cl-input-icon">${this.options.icon}</span>
                ` : ''}
                <input type="${this.options.type}"
                       class="cl-input ${this.error ? 'has-error' : ''}"
                       placeholder="${this.options.placeholder || ''}"
                       value="${this.value}"
                       ${this.options.disabled ? 'disabled' : ''}
                       ${this.options.readonly ? 'readonly' : ''}
                       ${this.options.validation?.required ? 'required' : ''}
                       ${this.options.validation?.minLength ? `minlength="${this.options.validation.minLength}"` : ''}
                       ${this.options.validation?.maxLength ? `maxlength="${this.options.validation.maxLength}"` : ''}
                       ${this.options.validation?.pattern ? `pattern="${this.options.validation.pattern}"` : ''}
                       ${this.options.autocomplete ? `autocomplete="${this.options.autocomplete}"` : ''}>
                ${hasIcon && this.options.iconPosition === 'right' ? `
                    <span class="cl-input-icon">${this.options.icon}</span>
                ` : ''}
                ${showClear ? `
                    <button type="button" class="cl-input-clear" aria-label="Clear input">×</button>
                ` : ''}
            </div>
            ${this.options.helperText || this.error ? `
                <div class="cl-input-helper ${this.error ? 'has-error' : ''}">
                    ${this.error || this.options.helperText}
                </div>
            ` : ''}
        `;
    }

    private attachEventListeners(): void {
        const input = this.element.querySelector('input');
        if (!input) return;

        input.addEventListener('input', (e) => {
            const target = e.target as HTMLInputElement;
            this.value = target.value;
            this.isDirty = true;
            this.validate();
            this.dispatchEvent('input', { value: this.value });
        });

        input.addEventListener('change', () => {
            this.dispatchEvent('change', { value: this.value });
        });

        input.addEventListener('focus', () => {
            this.element.classList.add('is-focused');
            this.dispatchEvent('focus', { value: this.value });
        });

        input.addEventListener('blur', () => {
            this.element.classList.remove('is-focused');
            this.validate();
            this.dispatchEvent('blur', { value: this.value });
        });

        // Clear button
        const clearButton = this.element.querySelector('.cl-input-clear');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clear();
            });
        }
    }

    private validate(): boolean {
        if (!this.isDirty) return true;
        this.error = null;

        const validation = this.options.validation;
        if (!validation) return true;

        if (validation.required && !this.value) {
            this.error = 'This field is required';
        } else if (validation.minLength && this.value.length < validation.minLength) {
            this.error = `Minimum length is ${validation.minLength} characters`;
        } else if (validation.maxLength && this.value.length > validation.maxLength) {
            this.error = `Maximum length is ${validation.maxLength} characters`;
        } else if (validation.pattern && !new RegExp(validation.pattern).test(this.value)) {
            this.error = 'Invalid format';
        } else if (validation.custom) {
            const result = validation.custom(this.value);
            if (typeof result === 'string') {
                this.error = result;
            } else if (!result) {
                this.error = 'Invalid value';
            }
        }

        this.render();
        this.dispatchEvent('validation', { 
            isValid: !this.error,
            error: this.error
        });

        return !this.error;
    }

    // Public API
    public getValue(): string {
        return this.value;
    }

    public setValue(value: string, triggerEvents: boolean = true): void {
        this.value = value;
        this.isDirty = true;
        this.validate();
        this.render();
        if (triggerEvents) {
            this.dispatchEvent('input', { value: this.value });
            this.dispatchEvent('change', { value: this.value });
        }
    }

    public clear(): void {
        this.setValue('');
    }

    public focus(): void {
        const input = this.element.querySelector('input');
        input?.focus();
    }

    public blur(): void {
        const input = this.element.querySelector('input');
        input?.blur();
    }

    public disable(): void {
        this.options.disabled = true;
        this.element.classList.add('cl-input-disabled');
        this.render();
    }

    public enable(): void {
        this.options.disabled = false;
        this.element.classList.remove('cl-input-disabled');
        this.render();
    }

    public setError(error: string | null): void {
        this.error = error;
        this.render();
    }

    public isValid(): boolean {
        return this.validate();
    }

    public reset(): void {
        this.value = '';
        this.error = null;
        this.isDirty = false;
        this.render();
    }
}
