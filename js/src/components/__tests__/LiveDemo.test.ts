import { LiveDemo } from '../LiveDemo';

describe('LiveDemo', () => {
    let container: HTMLElement;
    let liveDemo: LiveDemo;
    const testComponent = 'Button';
    const testCode = 'return new Button({ text: "Test" });';

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
        liveDemo = new LiveDemo('#test-container', {
            component: testComponent,
            code: testCode,
            height: '400px'
        });
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe('Rendering', () => {
        it('should render live demo with correct structure', () => {
            expect(container.querySelector('.cl-live-demo')).toBeTruthy();
            expect(container.querySelector('.cl-live-demo-editor')).toBeTruthy();
            expect(container.querySelector('.cl-live-demo-resize-handle')).toBeTruthy();
            expect(container.querySelector('.cl-live-demo-preview')).toBeTruthy();
        });

        it('should set correct height', () => {
            const demoElement = container.querySelector('.cl-live-demo') as HTMLElement;
            expect(demoElement.style.height).toBe('400px');
        });

        it('should use default height if not provided', () => {
            liveDemo = new LiveDemo('#test-container', {
                component: testComponent,
                code: testCode
            });
            const demoElement = container.querySelector('.cl-live-demo') as HTMLElement;
            expect(demoElement.style.height).toBe('400px');
        });
    });

    describe('Resize Functionality', () => {
        let editor: HTMLElement;
        let preview: HTMLElement;
        let resizeHandle: HTMLElement;

        beforeEach(() => {
            editor = container.querySelector('.cl-live-demo-editor') as HTMLElement;
            preview = container.querySelector('.cl-live-demo-preview') as HTMLElement;
            resizeHandle = container.querySelector('.cl-live-demo-resize-handle') as HTMLElement;
        });

        it('should start resize on mousedown', () => {
            resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
            expect(liveDemo['isResizing']).toBe(true);
        });

        it('should stop resize on mouseup', () => {
            resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
            document.dispatchEvent(new MouseEvent('mouseup'));
            expect(liveDemo['isResizing']).toBe(false);
        });

        it('should resize panels on mousemove', () => {
            resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
            
            const demoRect = { left: 0, width: 1000 };
            jest.spyOn(container.querySelector('.cl-live-demo') as HTMLElement, 'getBoundingClientRect')
                .mockReturnValue(demoRect as DOMRect);

            document.dispatchEvent(new MouseEvent('mousemove', { clientX: 400 }));
            
            expect(editor.style.width).toBe('40%');
            expect(preview.style.width).toBe('60%');
        });

        it('should not resize beyond limits', () => {
            resizeHandle.dispatchEvent(new MouseEvent('mousedown'));
            
            const demoRect = { left: 0, width: 1000 };
            jest.spyOn(container.querySelector('.cl-live-demo') as HTMLElement, 'getBoundingClientRect')
                .mockReturnValue(demoRect as DOMRect);

            // Try to resize too small
            document.dispatchEvent(new MouseEvent('mousemove', { clientX: 200 }));
            expect(editor.style.width).toBe('');
            
            // Try to resize too large
            document.dispatchEvent(new MouseEvent('mousemove', { clientX: 800 }));
            expect(editor.style.width).toBe('');
        });
    });

    describe('Monaco Editor Integration', () => {
        beforeEach(() => {
            // Mock Monaco editor
            (window as any).monaco = {
                editor: {
                    create: jest.fn()
                }
            };
        });

        it('should initialize Monaco editor with correct options', () => {
            liveDemo['setupEditor']();
            expect((window as any).monaco.editor.create).toHaveBeenCalledWith(
                expect.any(HTMLElement),
                expect.objectContaining({
                    value: testCode,
                    language: 'typescript',
                    theme: 'vs-dark'
                })
            );
        });

        it('should not initialize Monaco editor if not available', () => {
            (window as any).monaco = undefined;
            expect(() => liveDemo['setupEditor']()).not.toThrow();
        });
    });

    describe('Preview Updates', () => {
        it('should update preview content', () => {
            const testComponent = document.createElement('div');
            testComponent.textContent = 'Test Component';
            const mockComponent = `
                const div = document.createElement('div');
                div.textContent = 'Test Component';
                return div;
            `;

            liveDemo['updatePreview'](mockComponent);
            
            const previewContent = container.querySelector('.cl-live-demo-preview-content');
            expect(previewContent?.textContent).toBe('Test Component');
        });

        it('should handle preview update errors gracefully', () => {
            liveDemo['updatePreview']('invalid javascript');
            const previewContent = container.querySelector('.cl-live-demo-preview-content');
            expect(previewContent?.textContent).toBe('Failed to render preview');
        });
    });
});
