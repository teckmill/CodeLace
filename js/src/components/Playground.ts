import { Component } from './Component';

export interface PlaygroundOptions {
    component: string;
    properties: Record<string, any>;
    template: string;
}

export class Playground extends Component {
    private editor!: HTMLTextAreaElement;
    private preview!: HTMLDivElement;
    private component: any;
    protected readonly options: PlaygroundOptions;

    constructor(selector: string, options: PlaygroundOptions) {
        super(selector);
        this.options = options;
        this.render();
        this.initializeEditor();
    }

    private render() {
        this.element.innerHTML = `
            <div class="cl-playground">
                <div class="cl-playground-editor">
                    <textarea class="cl-playground-code"></textarea>
                </div>
                <div class="cl-playground-preview"></div>
            </div>
        `;
        this.editor = this.querySelector('.cl-playground-code');
        this.preview = this.querySelector('.cl-playground-preview');
    }

    private initializeEditor() {
        this.editor.value = JSON.stringify(this.options.properties, null, 2);
        this.editor.addEventListener('input', () => this.updatePreview());
        this.updatePreview();
    }

    private updatePreview() {
        try {
            const props = JSON.parse(this.editor.value);
            this.preview.innerHTML = this.options.template;
            const componentElement = this.preview.firstElementChild;
            
            if (componentElement) {
                // @ts-expect-error CodeLace components are registered globally
                this.component = new window.CodeLace[this.options.component](
                    componentElement,
                    props
                );
            }
        } catch (error) {
            this.handlePreviewError(error);
        }
    }

    private handlePreviewError(error: unknown) {
        this.preview.innerHTML = `<div class="cl-preview-error">Invalid JSON configuration</div>`;
    }
}
