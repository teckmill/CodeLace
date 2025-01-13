import { Component } from '../core/component';

interface TextAreaValidation {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: string;
    custom?: (value: string) => boolean | string;
}

interface TextAreaOptions {
    placeholder?: string;
    label?: string;
    helperText?: string;
    disabled?: boolean;
    readonly?: boolean;
    rows?: number;
    minRows?: number;
    maxRows?: number;
    autoResize?: boolean;
    validation?: TextAreaValidation;
    spellcheck?: boolean;
    resize?: 'none' | 'both' | 'horizontal' | 'vertical';
}

export class TextArea extends Component {
    protected readonly options: TextAreaOptions;
    private value: string = '';
    private error: string | null = null;
    private isDirty: boolean = false;
    private lineHeight: number = 0;

    constructor(selector: string, options: TextAreaOptions = {}) {
        super(selector);
        this.options = {
            rows: 3,
            minRows: 3,
            maxRows: 10,
            autoResize: true,
            spellcheck: true,
            resize: 'vertical',
            ...options
        };
        this.init();
    }

    private init(): void {
        this.element.classList.add('cl-textarea-wrapper');
        if (this.options.disabled) {
            this.element.classList.add('cl-textarea-disabled');
        }
        this.render();
        this.attachEventListeners();
        this.calculateLineHeight();
    }

    private render(): void {
        this.element.innerHTML = `
            ${this.options.label ? `
                <label class="cl-textarea-label">
                    ${this.options.label}
                    ${this.options.validation?.required ? '<span class="cl-textarea-required">*</span>' : ''}
                </label>
            ` : ''}
            <textarea class="cl-textarea ${this.error ? 'has-error' : ''}"
                      placeholder="${this.options.placeholder || ''}"
                      rows="${this.options.rows}"
                      ${this.options.disabled ? 'disabled' : ''}
                      ${this.options.readonly ? 'readonly' : ''}
                      ${this.options.validation?.required ? 'required' : ''}
                      ${this.options.validation?.maxLength ? `maxlength="${this.options.validation.maxLength}"` : ''}
                      spellcheck="${this.options.spellcheck}"
                      style="resize: ${this.options.resize}">${this.value}</textarea>
            ${this.options.helperText || this.error ? `
                <div class="cl-textarea-helper ${this.error ? 'has-error' : ''}">
                    ${this.error || this.options.helperText}
                </div>
            ` : ''}
        `;
    }

    private calculateLineHeight(): void {
        const textarea = this.element.querySelector('textarea');
        if (!textarea) return;

        // Create a single line to measure
        const temp = document.createElement('textarea');
        temp.className = 'cl-textarea';
        temp.style.height = 'auto';
        temp.style.position = 'absolute';
        temp.style.visibility = 'hidden';
        temp.rows = 1;
        temp.value = 'x';
        document.body.appendChild(temp);

        this.lineHeight = temp.scrollHeight;
        document.body.removeChild(temp);
    }

    private adjustHeight(): void {
        if (!this.options.autoResize) return;

        const textarea = this.element.querySelector('textarea');
        if (!textarea) return;

        // Reset height to allow scrollHeight to shrink
        textarea.style.height = 'auto';

        // Calculate new height
        const rows = Math.floor(textarea.scrollHeight / this.lineHeight);
        const newRows = Math.min(
            Math.max(rows, this.options.minRows || 1),
            this.options.maxRows || Infinity
        );

        textarea.style.height = `${newRows * this.lineHeight}px`;
    }

    private attachEventListeners(): void {
        const textarea = this.element.querySelector('textarea');
        if (!textarea) return;

        textarea.addEventListener('input', (e) => {
            const target = e.target as HTMLTextAreaElement;
            this.value = target.value;
            this.isDirty = true;
            this.validate();
            this.adjustHeight();
            this.dispatchEvent('input', { value: this.value });
        });

        textarea.addEventListener('change', () => {
            this.dispatchEvent('change', { value: this.value });
        });

        textarea.addEventListener('focus', () => {
            this.element.classList.add('is-focused');
            this.dispatchEvent('focus', { value: this.value });
        });

        textarea.addEventListener('blur', () => {
            this.element.classList.remove('is-focused');
            this.validate();
            this.dispatchEvent('blur', { value: this.value });
        });
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
        this.adjustHeight();
        if (triggerEvents) {
            this.dispatchEvent('input', { value: this.value });
            this.dispatchEvent('change', { value: this.value });
        }
    }

    public clear(): void {
        this.setValue('');
    }

    public focus(): void {
        const textarea = this.element.querySelector('textarea');
        textarea?.focus();
    }

    public blur(): void {
        const textarea = this.element.querySelector('textarea');
        textarea?.blur();
    }

    public disable(): void {
        this.options.disabled = true;
        this.element.classList.add('cl-textarea-disabled');
        this.render();
    }

    public enable(): void {
        this.options.disabled = false;
        this.element.classList.remove('cl-textarea-disabled');
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
        this.adjustHeight();
    }
}
