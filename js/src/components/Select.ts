import { Component } from '../core/component';

interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}

interface SelectOptions {
    multiple?: boolean;
    searchable?: boolean;
    placeholder?: string;
    clearable?: boolean;
    disabled?: boolean;
    required?: boolean;
    maxItems?: number;
}

export class Select extends Component {
    protected readonly options: SelectOptions;
    private items: SelectOption[] = [];
    private isOpen: boolean = false;
    private selectedItems: SelectOption[] = [];
    private searchText: string = '';
    private dropdownElement: HTMLElement | null = null;

    constructor(selector: string, items: SelectOption[], options: SelectOptions = {}) {
        super(selector);
        this.items = items;
        this.options = {
            multiple: false,
            searchable: false,
            placeholder: 'Select an option',
            clearable: true,
            disabled: false,
            required: false,
            maxItems: Infinity,
            ...options
        };
        this.init();
    }

    private init(): void {
        this.element.classList.add('cl-select');
        if (this.options.disabled) {
            this.element.classList.add('cl-select-disabled');
        }
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        const selectedLabels = this.selectedItems.map(item => item.label).join(', ');
        
        this.element.innerHTML = `
            <div class="cl-select-control">
                ${this.options.searchable ? `
                    <input type="text" 
                           class="cl-select-search" 
                           placeholder="${this.selectedItems.length ? selectedLabels : this.options.placeholder}"
                           value="${this.searchText}"
                           ${this.options.disabled ? 'disabled' : ''}>
                ` : `
                    <div class="cl-select-value">
                        ${selectedLabels || this.options.placeholder}
                    </div>
                `}
                ${this.options.clearable && this.selectedItems.length ? `
                    <button class="cl-select-clear" type="button">×</button>
                ` : ''}
                <div class="cl-select-arrow">▼</div>
            </div>
            <div class="cl-select-dropdown ${this.isOpen ? 'active' : ''}">
                ${this.renderOptions()}
            </div>
        `;

        this.dropdownElement = this.element.querySelector('.cl-select-dropdown');
    }

    private renderOptions(): string {
        const filteredItems = this.items.filter(item => 
            item.label.toLowerCase().includes(this.searchText.toLowerCase())
        );

        if (filteredItems.length === 0) {
            return '<div class="cl-select-no-results">No options found</div>';
        }

        return filteredItems.map(item => `
            <div class="cl-select-option ${item.disabled ? 'disabled' : ''} ${
                this.isSelected(item) ? 'selected' : ''
            }" data-value="${item.value}">
                ${this.options.multiple ? `
                    <input type="checkbox" 
                           ${this.isSelected(item) ? 'checked' : ''} 
                           ${item.disabled ? 'disabled' : ''}>
                ` : ''}
                ${item.label}
            </div>
        `).join('');
    }

    private attachEventListeners(): void {
        // Toggle dropdown
        this.element.querySelector('.cl-select-control')?.addEventListener('click', (e) => {
            if (this.options.disabled) return;
            if ((e.target as HTMLElement).classList.contains('cl-select-clear')) {
                e.stopPropagation();
                this.clear();
                return;
            }
            this.toggleDropdown();
        });

        // Search functionality
        if (this.options.searchable) {
            this.element.querySelector('.cl-select-search')?.addEventListener('input', (e) => {
                this.searchText = (e.target as HTMLInputElement).value;
                this.render();
            });

            this.element.querySelector('.cl-select-search')?.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }

        // Option selection
        this.element.addEventListener('click', (e) => {
            const option = (e.target as HTMLElement).closest('.cl-select-option');
            if (!option || option.classList.contains('disabled')) return;

            const value = option.getAttribute('data-value');
            if (!value) return;

            const item = this.items.find(i => i.value === value);
            if (!item) return;

            this.toggleSelection(item);
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.element.contains(e.target as Node)) {
                this.closeDropdown();
            }
        });
    }

    private toggleDropdown(): void {
        if (this.isOpen) {
            this.closeDropdown();
        } else {
            this.openDropdown();
        }
    }

    private openDropdown(): void {
        this.isOpen = true;
        this.render();
        this.positionDropdown();
    }

    private closeDropdown(): void {
        this.isOpen = false;
        this.searchText = '';
        this.render();
    }

    private positionDropdown(): void {
        if (!this.dropdownElement) return;

        const rect = this.element.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const dropdownHeight = this.dropdownElement.offsetHeight;

        if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
            this.dropdownElement.style.bottom = '100%';
            this.dropdownElement.style.top = 'auto';
        } else {
            this.dropdownElement.style.top = '100%';
            this.dropdownElement.style.bottom = 'auto';
        }
    }

    private toggleSelection(item: SelectOption): void {
        if (this.options.multiple) {
            const index = this.selectedItems.findIndex(i => i.value === item.value);
            if (index === -1) {
                if (this.selectedItems.length < this.options.maxItems!) {
                    this.selectedItems.push(item);
                }
            } else {
                this.selectedItems.splice(index, 1);
            }
        } else {
            this.selectedItems = [item];
            this.closeDropdown();
        }
        this.render();
        this.dispatchEvent('change', { selectedItems: this.selectedItems });
    }

    private isSelected(item: SelectOption): boolean {
        return this.selectedItems.some(i => i.value === item.value);
    }

    // Public API
    public getValue(): string | string[] {
        if (this.options.multiple) {
            return this.selectedItems.map(item => item.value);
        }
        return this.selectedItems[0]?.value || '';
    }

    public setValue(value: string | string[]): void {
        if (Array.isArray(value)) {
            this.selectedItems = this.items.filter(item => value.includes(item.value));
        } else {
            const item = this.items.find(item => item.value === value);
            if (item) {
                this.selectedItems = [item];
            }
        }
        this.render();
    }

    public clear(): void {
        this.selectedItems = [];
        this.render();
        this.dispatchEvent('change', { selectedItems: [] });
    }

    public disable(): void {
        this.options.disabled = true;
        this.element.classList.add('cl-select-disabled');
        this.render();
    }

    public enable(): void {
        this.options.disabled = false;
        this.element.classList.remove('cl-select-disabled');
        this.render();
    }

    public addOption(option: SelectOption): void {
        this.items.push(option);
        this.render();
    }

    public removeOption(value: string): void {
        const index = this.items.findIndex(item => item.value === value);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.selectedItems = this.selectedItems.filter(item => item.value !== value);
            this.render();
        }
    }

    public destroy(): void {
        super.destroy();
        document.removeEventListener('click', this.closeDropdown.bind(this));
    }
}
