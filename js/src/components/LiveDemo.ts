import { Component } from './Component';

interface LiveDemoOptions {
    component: string;
    code: string;
    height?: string;
}

export class LiveDemo extends Component {
    protected readonly options: LiveDemoOptions;
    private editor!: HTMLElement;
    private preview!: HTMLElement;
    private resizeHandle!: HTMLElement;
    private isResizing: boolean = false;

    constructor(selector: string, options: LiveDemoOptions) {
        super(selector);
        this.options = {
            height: '400px',
            ...options
        };
        this.render();
        this.setupEditor();
        this.attachEvents();
    }

    private render() {
        this.element.innerHTML = `
            <div class="cl-live-demo" style="height: ${this.options.height}">
                <div class="cl-live-demo-editor"></div>
                <div class="cl-live-demo-resize-handle"></div>
                <div class="cl-live-demo-preview">
                    <div class="cl-live-demo-preview-content"></div>
                </div>
            </div>
        `;

        this.editor = this.querySelector('.cl-live-demo-editor');
        this.preview = this.querySelector('.cl-live-demo-preview');
        this.resizeHandle = this.querySelector('.cl-live-demo-resize-handle');
    }

    private setupEditor() {
        // @ts-ignore - Monaco editor setup
        if (window.monaco) {
            // @ts-ignore
            monaco.editor.create(this.editor, {
                value: this.options.code,
                language: 'typescript',
                theme: 'vs-dark',
                minimap: { enabled: false },
                automaticLayout: true,
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 2,
                renderWhitespace: 'none',
                contextmenu: true,
                quickSuggestions: true,
                renderLineHighlight: 'all',
                scrollbar: {
                    vertical: 'visible',
                    horizontal: 'visible',
                    useShadows: false,
                    verticalScrollbarSize: 10,
                    horizontalScrollbarSize: 10
                }
            });
        }
    }

    private attachEvents() {
        this.resizeHandle.addEventListener('mousedown', this.startResize.bind(this));
        document.addEventListener('mousemove', this.resize.bind(this));
        document.addEventListener('mouseup', this.stopResize.bind(this));
    }

    private startResize(e: MouseEvent) {
        this.isResizing = true;
        e.preventDefault();
    }

    private resize(e: MouseEvent) {
        if (!this.isResizing) return;

        const container = this.querySelector<HTMLElement>('.cl-live-demo');
        const containerRect = container.getBoundingClientRect();
        const percentage = ((e.clientX - containerRect.left) / containerRect.width) * 100;

        if (percentage > 30 && percentage < 70) {
            this.editor.style.width = `${percentage}%`;
            this.preview.style.width = `${100 - percentage}%`;
        }
    }

    private stopResize() {
        this.isResizing = false;
    }

    private updatePreview(code: string) {
        try {
            const preview = this.querySelector<HTMLElement>('.cl-live-demo-preview-content');
            // Safely evaluate the code and render the preview
            const component = new Function('return ' + code)();
            preview.innerHTML = '';
            preview.appendChild(component);
        } catch (error) {
            console.error('Preview update failed:', error);
        }
    }
}
