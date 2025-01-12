import { Component } from '../core/component';

interface CheckboxOption {
    value: string;
    label: string;
    disabled?: boolean;
    checked?: boolean;
}

interface CheckboxOptions {
    name?: string;
    inline?: boolean;
    disabled?: boolean;
    indeterminate?: boolean;
    required?: boolean;
}

export class Checkbox extends Component {
    protected options: CheckboxOptions;
    private items: CheckboxOption[] = [];
    private selectedValues: Set<string> = new Set();

    constructor(selector: string, items: CheckboxOption[], options: CheckboxOptions = {}) {
        super(selector);
        this.items = items;
        this.options = {
            inline: false,
            disabled: false,
            indeterminate: false,
            required: false,
            ...options
        };
        this.init();
    }

    private init(): void {
        this.element.classList.add('cl-checkbox-group');
        if (this.options.inline) {
            this.element.classList.add('cl-checkbox-inline');
        }
        if (this.options.disabled) {
            this.element.classList.add('cl-checkbox-disabled');
        }

        // Set initial values
        this.items.forEach(item => {
            if (item.checked) {
                this.selectedValues.add(item.value);
            }
        });

        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        this.element.innerHTML = this.items.map(item => `
            <label class="cl-checkbox ${item.disabled || this.options.disabled ? 'disabled' : ''}">
                <input type="checkbox"
                       name="${this.options.name || ''}"
                       value="${item.value}"
                       ${this.selectedValues.has(item.value) ? 'checked' : ''}
                       ${item.disabled || this.options.disabled ? 'disabled' : ''}
                       ${this.options.required ? 'required' : ''}
                       ${this.options.indeterminate ? 'data-indeterminate="true"' : ''}>
                <span class="cl-checkbox-mark"></span>
                <span class="cl-checkbox-label">${item.label}</span>
            </label>
        `).join('');

        // Set indeterminate state
        if (this.options.indeterminate) {
            const checkboxes = this.element.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                if (checkbox instanceof HTMLInputElement) {
                    checkbox.indeterminate = true;
                }
            });
        }
    }

    private attachEventListeners(): void {
        this.element.addEventListener('change', (e) => {
            const input = e.target as HTMLInputElement;
            if (input.type === 'checkbox') {
                const value = input.value;
                if (input.checked) {
                    this.selectedValues.add(value);
                } else {
                    this.selectedValues.delete(value);
                }
                this.dispatchEvent('change', {
                    value,
                    checked: input.checked,
                    selectedValues: Array.from(this.selectedValues)
                });
            }
        });
    }

    // Public API
    public getValues(): string[] {
        return Array.from(this.selectedValues);
    }

    public setValue(value: string, checked: boolean): void {
        const item = this.items.find(item => item.value === value);
        if (item && !item.disabled && !this.options.disabled) {
            if (checked) {
                this.selectedValues.add(value);
            } else {
                this.selectedValues.delete(value);
            }
            this.render();
            this.dispatchEvent('change', {
                value,
                checked,
                selectedValues: Array.from(this.selectedValues)
            });
        }
    }

    public setValues(values: string[]): void {
        this.selectedValues.clear();
        values.forEach(value => {
            const item = this.items.find(item => item.value === value);
            if (item && !item.disabled && !this.options.disabled) {
                this.selectedValues.add(value);
            }
        });
        this.render();
        this.dispatchEvent('change', {
            selectedValues: Array.from(this.selectedValues)
        });
    }

    public checkAll(): void {
        if (this.options.disabled) return;
        this.items.forEach(item => {
            if (!item.disabled) {
                this.selectedValues.add(item.value);
            }
        });
        this.render();
        this.dispatchEvent('change', {
            selectedValues: Array.from(this.selectedValues)
        });
    }

    public uncheckAll(): void {
        if (this.options.disabled) return;
        this.selectedValues.clear();
        this.render();
        this.dispatchEvent('change', {
            selectedValues: []
        });
    }

    public toggle(value: string): void {
        const isSelected = this.selectedValues.has(value);
        this.setValue(value, !isSelected);
    }

    public disable(): void {
        this.options.disabled = true;
        this.element.classList.add('cl-checkbox-disabled');
        this.render();
    }

    public enable(): void {
        this.options.disabled = false;
        this.element.classList.remove('cl-checkbox-disabled');
        this.render();
    }

    public addOption(option: CheckboxOption): void {
        this.items.push(option);
        if (option.checked) {
            this.selectedValues.add(option.value);
        }
        this.render();
    }

    public removeOption(value: string): void {
        const index = this.items.findIndex(item => item.value === value);
        if (index !== -1) {
            this.selectedValues.delete(value);
            this.items.splice(index, 1);
            this.render();
        }
    }

    public setIndeterminate(value: boolean): void {
        this.options.indeterminate = value;
        this.render();
    }
}
