import { Component } from './Component';

interface CodeBlockOptions {
    language: string;
    code: string;
    showCopy?: boolean;
    showPreview?: boolean;
}

export class CodeBlock extends Component {
    protected readonly options: CodeBlockOptions;
    private previewElement!: HTMLElement;
    private codeElement!: HTMLElement;

    constructor(selector: string, options: CodeBlockOptions) {
        super(selector);
        this.options = {
            showCopy: true,
            showPreview: true,
            ...options
        };
        this.render();
        this.attachEvents();
    }

    private render() {
        this.element.innerHTML = `
            <div class="cl-code-block">
                ${this.options.showPreview ? `
                    <div class="cl-code-preview">
                        <div class="cl-preview-content"></div>
                    </div>
                ` : ''}
                <div class="cl-code-container">
                    <div class="cl-code-header">
                        <span class="cl-code-language">${this.options.language}</span>
                        ${this.options.showCopy ? `
                            <button class="cl-copy-button">
                                <span class="cl-copy-icon">📋</span>
                                <span class="cl-copy-text">Copy</span>
                            </button>
                        ` : ''}
                    </div>
                    <pre class="cl-code-content"><code class="language-${this.options.language}">${this.escapeHtml(this.options.code)}</code></pre>
                </div>
            </div>
        `;

        this.previewElement = this.querySelector('.cl-preview-content');
        this.codeElement = this.querySelector('code');

        if (this.previewElement && this.options.showPreview) {
            this.previewElement.innerHTML = this.options.code;
        }
    }

    private attachEvents() {
        const copyButton = this.querySelector<HTMLButtonElement>('.cl-copy-button');
        if (copyButton) {
            copyButton.addEventListener('click', () => this.copyCode());
        }
    }

    private async copyCode() {
        const code = this.options.code;
        try {
            await navigator.clipboard.writeText(code);
            this.showCopySuccess();
        } catch (err) {
            // Handle clipboard error silently
            this.handleCopyError(err);
        }
    }

    private handleCopyError(error: unknown) {
        const button = this.querySelector<HTMLButtonElement>('.cl-copy-button');
        const text = button.querySelector<HTMLSpanElement>('.cl-copy-text')!;
        text.textContent = 'Failed to copy';
        button.classList.add('error');
        setTimeout(() => {
            text.textContent = 'Copy';
            button.classList.remove('error');
        }, 2000);
    }

    private showCopySuccess() {
        const button = this.querySelector<HTMLButtonElement>('.cl-copy-button');
        const text = button.querySelector<HTMLSpanElement>('.cl-copy-text')!;
        const originalText = text.textContent;

        text.textContent = 'Copied!';
        button.classList.add('success');

        setTimeout(() => {
            text.textContent = originalText;
            button.classList.remove('success');
        }, 2000);
    }

    private escapeHtml(html: string): string {
        const div = document.createElement('div');
        div.textContent = html;
        return div.innerHTML;
    }

    updateCode(code: string) {
        this.options.code = code;
        this.render();
        // @ts-expect-error Prism is loaded globally
        if (window.Prism) {
            // @ts-expect-error Using Prism API
            Prism.highlightElement(this.codeElement);
        }
    }
}
