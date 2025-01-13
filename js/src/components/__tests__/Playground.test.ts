import { Playground } from '../Playground';

describe('Playground', () => {
    let container: HTMLElement;
    let playground: Playground;
    const testOptions = {
        component: 'Button',
        properties: {
            text: 'Test Button',
            variant: 'primary'
        },
        template: '<button class="cl-button"></button>'
    };

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
        playground = new Playground('#test-container', testOptions);

        // Mock CodeLace global object
        (window as any).CodeLace = {
            Button: jest.fn().mockImplementation((element, props) => {
                element.textContent = props.text;
                element.className = `cl-button cl-button-${props.variant}`;
                return element;
            })
        };
    });

    afterEach(() => {
        document.body.removeChild(container);
        delete (window as any).CodeLace;
    });

    describe('Rendering', () => {
        it('should render playground with correct structure', () => {
            expect(container.querySelector('.cl-playground')).toBeTruthy();
            expect(container.querySelector('.cl-playground-editor')).toBeTruthy();
            expect(container.querySelector('.cl-playground-preview')).toBeTruthy();
        });

        it('should render editor with initial properties', () => {
            const editor = container.querySelector('.cl-playground-code') as HTMLTextAreaElement;
            expect(JSON.parse(editor.value)).toEqual(testOptions.properties);
        });

        it('should render preview with initial template', () => {
            const preview = container.querySelector('.cl-playground-preview');
            expect(preview?.innerHTML).toBe('<div class="cl-preview-error">Invalid JSON configuration</div>');
        });
    });

    describe('Editor Functionality', () => {
        it('should update preview when properties change', () => {
            const editor = container.querySelector('.cl-playground-code') as HTMLTextAreaElement;
            const newProps = {
                text: 'Updated Button',
                variant: 'secondary'
            };
            
            editor.value = JSON.stringify(newProps);
            editor.dispatchEvent(new Event('input'));

            const previewButton = container.querySelector('.cl-button');
            expect(previewButton?.textContent).toBe('Updated Button');
            expect(previewButton?.className).toBe('cl-button cl-button-secondary');
        });

        it('should handle invalid JSON gracefully', () => {
            const editor = container.querySelector('.cl-playground-editor') as HTMLTextAreaElement;
            editor.value = 'invalid json';
            editor.dispatchEvent(new Event('input'));

            const preview = container.querySelector('.cl-playground-preview');
            expect(preview?.innerHTML).toBe('<div class="cl-preview-error">Invalid JSON configuration</div>');
        });
    });

    describe('Component Integration', () => {
        it('should create component with correct properties', () => {
            const componentSpy = jest.spyOn((window as any).CodeLace, 'Button');
            playground['updatePreview']();
            expect(componentSpy).toHaveBeenCalledWith(
                expect.any(Element),
                testOptions.properties
            );
        });

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
            editor.value = JSON.stringify({ text: 'Test Button' });
            editor.dispatchEvent(new Event('input'));
            
            const firstInstance = playground['component'];
            playground['updatePreview']();
            expect(playground['component']).toBe(firstInstance);
        });

        it('should create new component instance when template changes', () => {
            const firstInstance = playground['component'];
            playground['options'].template = '<button class="cl-button-new"></button>';
            playground['updatePreview']();
            expect(playground['component']).not.toBe(firstInstance);
        });
    });
});
