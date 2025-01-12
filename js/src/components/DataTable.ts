import { Component } from '../core/component';

interface DataTableOptions {
    sortable?: boolean;
    filterable?: boolean;
    pagination?: boolean;
    itemsPerPage?: number;
    selectable?: boolean;
}

export class DataTable extends Component {
    protected options: DataTableOptions;
    private data: any[];
    private columns: string[];
    private currentPage: number = 1;
    private sortColumn: string | null = null;
    private sortDirection: 'asc' | 'desc' = 'asc';

    constructor(selector: string, data: any[], columns: string[], options: DataTableOptions = {}) {
        super(selector);
        this.data = data;
        this.columns = columns;
        this.options = {
            sortable: true,
            filterable: true,
            pagination: true,
            itemsPerPage: 10,
            selectable: false,
            ...options
        };
        this.init();
    }

    private init(): void {
        this.render();
        this.attachEventListeners();
    }

    private render(): void {
        const table = document.createElement('div');
        table.className = 'cl-table-container';

        // Add filter if enabled
        if (this.options.filterable) {
            const filterContainer = document.createElement('div');
            filterContainer.className = 'cl-table-filter';
            filterContainer.innerHTML = `
                <input type="text" class="cl-table-search" placeholder="Search...">
            `;
            table.appendChild(filterContainer);
        }

        // Create table
        const tableElement = document.createElement('table');
        tableElement.className = 'cl-data-table';

        // Header
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                ${this.options.selectable ? '<th><input type="checkbox" class="cl-select-all"></th>' : ''}
                ${this.columns.map(column => `
                    <th class="${this.options.sortable ? 'cl-sortable' : ''}" data-column="${column}">
                        ${column}
                        ${this.options.sortable ? '<span class="cl-sort-icon"></span>' : ''}
                    </th>
                `).join('')}
            </tr>
        `;
        tableElement.appendChild(thead);

        // Body
        const tbody = document.createElement('tbody');
        this.renderTableBody(tbody);
        tableElement.appendChild(tbody);

        table.appendChild(tableElement);

        // Pagination
        if (this.options.pagination) {
            const paginationContainer = document.createElement('div');
            paginationContainer.className = 'cl-pagination';
            this.renderPagination(paginationContainer);
            table.appendChild(paginationContainer);
        }

        this.element.innerHTML = '';
        this.element.appendChild(table);
    }

    private renderTableBody(tbody: HTMLElement): void {
        const start = (this.currentPage - 1) * (this.options.itemsPerPage || 10);
        const end = start + (this.options.itemsPerPage || 10);
        const displayData = this.getSortedData().slice(start, end);

        tbody.innerHTML = displayData.map(row => `
            <tr>
                ${this.options.selectable ? '<td><input type="checkbox" class="cl-select-row"></td>' : ''}
                ${this.columns.map(column => `<td>${row[column]}</td>`).join('')}
            </tr>
        `).join('');
    }

    private renderPagination(container: HTMLElement): void {
        const totalPages = Math.ceil(this.data.length / (this.options.itemsPerPage || 10));
        container.innerHTML = `
            <button class="cl-pagination-prev" ${this.currentPage === 1 ? 'disabled' : ''}>Previous</button>
            <span class="cl-pagination-info">Page ${this.currentPage} of ${totalPages}</span>
            <button class="cl-pagination-next" ${this.currentPage === totalPages ? 'disabled' : ''}>Next</button>
        `;
    }

    private getSortedData(): any[] {
        if (!this.sortColumn) return this.data;

        return [...this.data].sort((a, b) => {
            const aVal = a[this.sortColumn!];
            const bVal = b[this.sortColumn!];
            const comparison = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            return this.sortDirection === 'asc' ? comparison : -comparison;
        });
    }

    private attachEventListeners(): void {
        if (this.options.sortable) {
            this.element.querySelectorAll('.cl-sortable').forEach(header => {
                header.addEventListener('click', () => this.handleSort(header as HTMLElement));
            });
        }

        if (this.options.filterable) {
            const searchInput = this.element.querySelector('.cl-table-search');
            searchInput?.addEventListener('input', (e) => this.handleFilter((e.target as HTMLInputElement).value));
        }

        if (this.options.pagination) {
            this.element.querySelector('.cl-pagination-prev')?.addEventListener('click', () => this.previousPage());
            this.element.querySelector('.cl-pagination-next')?.addEventListener('click', () => this.nextPage());
        }

        if (this.options.selectable) {
            this.element.querySelector('.cl-select-all')?.addEventListener('click', (e) => this.handleSelectAll(e));
        }
    }

    private handleSort(header: HTMLElement): void {
        const column = header.dataset.column;
        if (!column) return;

        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        this.render();
    }

    private handleFilter(value: string): void {
        this.data = this.data.filter(row => 
            Object.values(row).some(cell => 
                String(cell).toLowerCase().includes(value.toLowerCase())
            )
        );
        this.currentPage = 1;
        this.render();
    }

    private previousPage(): void {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.render();
        }
    }

    private nextPage(): void {
        const totalPages = Math.ceil(this.data.length / (this.options.itemsPerPage || 10));
        if (this.currentPage < totalPages) {
            this.currentPage++;
            this.render();
        }
    }

    private handleSelectAll(e: Event): void {
        const checked = (e.target as HTMLInputElement).checked;
        this.element.querySelectorAll('.cl-select-row').forEach(checkbox => {
            (checkbox as HTMLInputElement).checked = checked;
        });
    }

    // Public API
    public refresh(newData?: any[]): void {
        if (newData) this.data = newData;
        this.render();
    }

    public getSelectedRows(): any[] {
        const selectedIndices: number[] = [];
        this.element.querySelectorAll('.cl-select-row').forEach((checkbox, index) => {
            if ((checkbox as HTMLInputElement).checked) {
                selectedIndices.push(index);
            }
        });
        return selectedIndices.map(index => this.data[index]);
    }

    public setPage(page: number): void {
        const totalPages = Math.ceil(this.data.length / (this.options.itemsPerPage || 10));
        if (page >= 1 && page <= totalPages) {
            this.currentPage = page;
            this.render();
        }
    }
}
