import { Playground, PlaygroundOptions } from '../Playground';

describe('Playground', () => {
    let container: HTMLElement;
    let playground: Playground;
    const testOptions: PlaygroundOptions = {
        template: '<button class="cl-button"></button>',
        component: 'Button',
        properties: { text: 'Test Button' }
    };

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);

        // Mock the Button component
        (window as any).CodeLace = {
            Button: jest.fn().mockImplementation((element: HTMLElement, props: any) => {
                element.textContent = props.text;
                return element;
            })
        };

        playground = new Playground('#test-container', testOptions);
        // Initialize with valid JSON to avoid initial error state
        const editor = container.querySelector('.cl-playground-editor') as HTMLTextAreaElement;
        if (editor) {
            editor.value = JSON.stringify(testOptions.properties);
            editor.dispatchEvent(new Event('input'));
        }
    });

    afterEach(() => {
        document.body.removeChild(container);
        delete (window as any).CodeLace;
    });

    describe('Rendering', () => {
        it('should render preview with initial template', () => {
            const preview = container.querySelector('.cl-playground-preview');
            expect(preview?.innerHTML.trim()).toBe(testOptions.template);
        });
    });

    describe('Editor Functionality', () => {
        it('should handle invalid JSON gracefully', () => {
            const editor = container.querySelector('.cl-playground-editor') as HTMLTextAreaElement;
            editor.value = 'invalid json';
            editor.dispatchEvent(new Event('input'));

            const preview = container.querySelector('.cl-playground-preview');
            expect(preview?.innerHTML).toBe('<div class="cl-preview-error">Invalid JSON configuration</div>');
        });
    });

    describe('Component Integration', () => {
        it('should handle missing component gracefully', () => {
            const preview = container.querySelector('.cl-playground-preview');
            playground['options'].component = 'NonExistentComponent';
            playground['updatePreview']();
            
            expect(preview?.innerHTML).toBe('<div class="cl-preview-error">Invalid JSON configuration</div>');
        });
    });

    describe('Preview Updates', () => {
        it('should preserve existing component instance', () => {
            const editor = container.querySelector('.cl-playground-editor') as HTMLTextAreaElement;
            editor.value = JSON.stringify({ text: 'Updated Button' });
            editor.dispatchEvent(new Event('input'));
            
            const firstInstance = playground['component'];
            playground['updatePreview']();
            expect(playground['component']).toBe(firstInstance);
        });

        it('should create new component instance when template changes', () => {
            const editor = container.querySelector('.cl-playground-editor') as HTMLTextAreaElement;
            editor.value = JSON.stringify({ text: 'New Button' });
            editor.dispatchEvent(new Event('input'));
            
            const firstInstance = playground['component'];
            playground['options'].template = '<button class="cl-button-new"></button>';
            playground['updatePreview']();
            
            const newInstance = playground['component'];
            expect(newInstance).toBeDefined();
            expect(newInstance).not.toBe(firstInstance);
        });
    });
});
