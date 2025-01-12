import { Component } from '../core/component';

interface NumberInputOptions {
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    readonly?: boolean;
    size?: 'small' | 'medium' | 'large';
    label?: string;
    placeholder?: string;
    helperText?: string;
    prefix?: string;
    suffix?: string;
    controls?: boolean;
    precision?: number;
    validation?: (value: number) => boolean | string;
}

export class NumberInput extends Component {
    protected options: NumberInputOptions;
    private value: number;
    private error: string | null = null;
    private isDirty: boolean = false;

    constructor(selector: string, options: NumberInputOptions = {}) {
        super(selector);
        this.options = {
            value: 0,
            min: -Infinity,
            max: Infinity,
            step: 1,
            disabled: false,
            readonly: false,
            size: 'medium',
            controls: true,
            precision: 0,
            ...options
        };
        this.value = this.options.value!;
        this.init();
    }

    private init(): void {
        this.element.classList.add('cl-number-input');
        this.element.classList.add(`cl-number-input-${this.options.size}`);
        if (this.options.disabled) {
            this.element.classList.add('cl-number-input-disabled');
        }
        if (this.options.readonly) {
            this.element.classList.add('cl-number-input-readonly');
        }
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        const prefixContent = this.options.prefix ? `
            <span class="cl-number-input-prefix">${this.options.prefix}</span>
        ` : '';

        const suffixContent = this.options.suffix ? `
            <span class="cl-number-input-suffix">${this.options.suffix}</span>
        ` : '';

        const controlsContent = this.options.controls ? `
            <div class="cl-number-input-controls">
                <button type="button" 
                        class="cl-number-input-increment" 
                        ${this.options.disabled || this.options.readonly ? 'disabled' : ''}>
                    <span class="cl-number-input-arrow">▲</span>
                </button>
                <button type="button" 
                        class="cl-number-input-decrement"
                        ${this.options.disabled || this.options.readonly ? 'disabled' : ''}>
                    <span class="cl-number-input-arrow">▼</span>
                </button>
            </div>
        ` : '';

        this.element.innerHTML = `
            ${this.options.label ? `
                <label class="cl-number-input-label">
                    ${this.options.label}
                </label>
            ` : ''}
            <div class="cl-number-input-container">
                ${prefixContent}
                <input type="number"
                       class="cl-number-input-field ${this.error ? 'has-error' : ''}"
                       value="${this.formatValue(this.value)}"
                       min="${this.options.min}"
                       max="${this.options.max}"
                       step="${this.options.step}"
                       ${this.options.disabled ? 'disabled' : ''}
                       ${this.options.readonly ? 'readonly' : ''}
                       placeholder="${this.options.placeholder || ''}"
                       aria-invalid="${Boolean(this.error)}"
                       ${this.error ? `aria-errormessage="error-${this.element.id}"` : ''}>
                ${suffixContent}
                ${controlsContent}
            </div>
            ${this.options.helperText || this.error ? `
                <div class="cl-number-input-helper ${this.error ? 'has-error' : ''}"
                     ${this.error ? `id="error-${this.element.id}"` : ''}>
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
            this.handleInput(target.value);
        });

        input.addEventListener('blur', () => {
            this.validate();
            this.dispatchEvent('blur', { value: this.value });
        });

        if (this.options.controls) {
            const increment = this.element.querySelector('.cl-number-input-increment');
            const decrement = this.element.querySelector('.cl-number-input-decrement');

            increment?.addEventListener('click', () => this.increment());
            decrement?.addEventListener('click', () => this.decrement());

            // Keyboard support for controls
            increment?.addEventListener('keydown', ((e: Event) => {
                const keyboardEvent = e as KeyboardEvent;
                if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                    e.preventDefault();
                    this.increment();
                }
            }) as EventListener);

            decrement?.addEventListener('keydown', ((e: Event) => {
                const keyboardEvent = e as KeyboardEvent;
                if (keyboardEvent.key === 'Enter' || keyboardEvent.key === ' ') {
                    e.preventDefault();
                    this.decrement();
                }
            }) as EventListener);
        }
    }

    private handleInput(value: string): void {
        this.isDirty = true;
        const numValue = value === '' ? 0 : parseFloat(value);
        
        if (isNaN(numValue)) {
            this.error = 'Please enter a valid number';
            return;
        }

        this.setValue(numValue, true);
    }

    private validate(): boolean {
        if (!this.isDirty) return true;
        this.error = null;

        if (this.value < this.options.min!) {
            this.error = `Value must be at least ${this.options.min}`;
        } else if (this.value > this.options.max!) {
            this.error = `Value must be at most ${this.options.max}`;
        } else if (this.options.validation) {
            const result = this.options.validation(this.value);
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

    private formatValue(value: number): string {
        return value.toFixed(this.options.precision);
    }

    private increment(): void {
        if (this.options.disabled || this.options.readonly) return;
        this.setValue(this.value + this.options.step!, true);
    }

    private decrement(): void {
        if (this.options.disabled || this.options.readonly) return;
        this.setValue(this.value - this.options.step!, true);
    }

    // Public API
    public getValue(): number {
        return this.value;
    }

    public setValue(value: number, triggerEvents: boolean = true): void {
        const newValue = Math.min(
            Math.max(value, this.options.min!),
            this.options.max!
        );

        if (this.value !== newValue) {
            this.value = newValue;
            this.isDirty = true;
            this.validate();
            this.render();

            if (triggerEvents) {
                this.dispatchEvent('input', { value: this.value });
                this.dispatchEvent('change', { value: this.value });
            }
        }
    }

    public disable(): void {
        this.options.disabled = true;
        this.element.classList.add('cl-number-input-disabled');
        this.render();
    }

    public enable(): void {
        this.options.disabled = false;
        this.element.classList.remove('cl-number-input-disabled');
        this.render();
    }

    public setReadonly(readonly: boolean): void {
        this.options.readonly = readonly;
        this.element.classList.toggle('cl-number-input-readonly', readonly);
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
        this.value = this.options.value!;
        this.error = null;
        this.isDirty = false;
        this.render();
    }
}
