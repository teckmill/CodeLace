import { CodeBlock } from '../CodeBlock';

describe('CodeBlock', () => {
    let container: HTMLElement;
    let codeBlock: CodeBlock;
    const testCode = 'const test = "Hello World";';
    const testOptions = {
        language: 'typescript',
        code: testCode,
        showCopy: true,
        showPreview: true
    };

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-container';
        container.innerHTML = `
            <div class="cl-code-block">
                <div class="cl-code-preview"></div>
                <div class="cl-code-container">
                    <div class="cl-code-header">
                        <div class="cl-copy-button"></div>
                    </div>
                    <div class="cl-code-content">
                        <pre><code class="language-${testOptions.language}">${testCode}</code></pre>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(container);
        codeBlock = new CodeBlock('#test-container', testOptions);
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe('Rendering', () => {
        it('should render code with correct language', () => {
            const codeElement = container.querySelector('code');
            expect(codeElement?.classList.contains(`language-${testOptions.language}`)).toBe(true);
            expect(codeElement?.textContent).toBe(testCode);
        });

        it('should render copy button by default', () => {
            const copyButton = container.querySelector('.cl-copy-button');
            expect(copyButton).toBeTruthy();
        });

        it('should not render copy button when showCopy is false', () => {
            container.innerHTML = `
                <div class="cl-code-block">
                    <div class="cl-code-preview"></div>
                    <div class="cl-code-container">
                        <div class="cl-code-header"></div>
                        <div class="cl-code-content">
                            <pre><code class="language-${testOptions.language}">${testCode}</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const options = { ...testOptions, showCopy: false };
            new CodeBlock('#test-container', options);
            const copyButton = container.querySelector('.cl-copy-button');
            expect(copyButton).toBeNull();
        });

        it('should not render preview when showPreview is false', () => {
            container.innerHTML = `
                <div class="cl-code-block">
                    <div class="cl-code-container">
                        <div class="cl-code-header">
                            <div class="cl-copy-button"></div>
                        </div>
                        <div class="cl-code-content">
                            <pre><code class="language-${testOptions.language}">${testCode}</code></pre>
                        </div>
                    </div>
                </div>
            `;
            const options = { ...testOptions, showPreview: false };
            new CodeBlock('#test-container', options);
            const preview = container.querySelector('.cl-preview-content');
            expect(preview).toBeNull();
        });
    });

    describe('Copy Functionality', () => {
        beforeEach(() => {
            // Mock clipboard API
            Object.assign(navigator, {
                clipboard: {
                    writeText: jest.fn().mockResolvedValue(undefined)
                }
            });
        });

        it('should copy code when copy button is clicked', async () => {
            const copyButton = container.querySelector('.cl-copy-button') as HTMLButtonElement;
            copyButton?.click();
            expect(navigator.clipboard.writeText).toHaveBeenCalledWith(testCode);
        });

        it('should show success message after copying', async () => {
            const copyButton = container.querySelector('.cl-copy-button') as HTMLButtonElement;
            copyButton?.click();
            await new Promise(resolve => setTimeout(resolve, 0));
            expect(copyButton.querySelector('.cl-copy-text')?.textContent).toBe('Copied!');
        });

        it('should reset copy button text after delay', async () => {
            const copyButton = container.querySelector('.cl-copy-button') as HTMLButtonElement;
            copyButton?.click();
            await new Promise(resolve => setTimeout(resolve, 2100));
            expect(copyButton.querySelector('.cl-copy-text')?.textContent).toBe('Copy');
        });
    });

    describe('Code Updates', () => {
        it('should update code content when updateCode is called', () => {
            const newCode = 'const updated = "New Code";';
            codeBlock.updateCode(newCode);
            const codeElement = container.querySelector('code');
            expect(codeElement?.textContent).toBe(newCode);
        });

        it('should preserve language when updating code', () => {
            const newCode = 'const updated = "New Code";';
            codeBlock.updateCode(newCode);
            const codeElement = container.querySelector('code');
            expect(codeElement?.className).toContain('language-typescript');
        });
    });
});
