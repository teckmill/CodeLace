import { Component } from '../Component';

class TestComponent extends Component {
    constructor(selector: string | HTMLElement) {
        super(selector);
    }
}

describe('Component', () => {
    let container: HTMLElement;
    let component: TestComponent;

    beforeEach(() => {
        container = document.createElement('div');
        container.id = 'test-container';
        document.body.appendChild(container);
        component = new TestComponent('#test-container');
    });

    afterEach(() => {
        document.body.removeChild(container);
    });

    describe('Constructor', () => {
        it('should create component with string selector', () => {
            expect(component['element']).toBe(container);
        });

        it('should create component with HTMLElement', () => {
            const elementComponent = new TestComponent(container);
            expect(elementComponent['element']).toBe(container);
        });

        it('should throw error for invalid selector', () => {
            expect(() => new TestComponent('#invalid-selector')).toThrow();
        });
    });

    describe('DOM Manipulation', () => {
        it('should query single element', () => {
            const child = document.createElement('span');
            child.classList.add('test-child');
            container.appendChild(child);

            const queried = component['querySelector']<HTMLSpanElement>('.test-child');
            expect(queried).toBe(child);
        });

        it('should query multiple elements', () => {
            const children = Array.from({ length: 3 }, () => {
                const child = document.createElement('span');
                child.classList.add('test-child');
                container.appendChild(child);
                return child;
            });

            const queried = component['querySelectorAll']<HTMLSpanElement>('.test-child');
            expect(Array.from(queried)).toEqual(children);
        });

        it('should throw error for non-existent element', () => {
            expect(() => component['querySelector']('.non-existent')).toThrow();
        });
    });

    describe('Class Manipulation', () => {
        it('should add class', () => {
            component['addClass']('test-class');
            expect(container.classList.contains('test-class')).toBe(true);
        });

        it('should remove class', () => {
            container.classList.add('test-class');
            component['removeClass']('test-class');
            expect(container.classList.contains('test-class')).toBe(false);
        });

        it('should toggle class', () => {
            component['toggleClass']('test-class');
            expect(container.classList.contains('test-class')).toBe(true);
            component['toggleClass']('test-class');
            expect(container.classList.contains('test-class')).toBe(false);
        });

        it('should check class existence', () => {
            container.classList.add('test-class');
            expect(component['hasClass']('test-class')).toBe(true);
            expect(component['hasClass']('non-existent')).toBe(false);
        });
    });

    describe('Style Manipulation', () => {
        it('should set style', () => {
            component['setStyle']('color', 'red');
            expect(container.style.getPropertyValue('color')).toBe('red');
        });

        it('should get style', () => {
            container.style.setProperty('color', 'red');
            expect(component['getStyle']('color')).toBe('red');
        });
    });

    describe('Data Attributes', () => {
        it('should set data attribute', () => {
            component['setData']('test', 'value');
            expect(container.dataset.test).toBe('value');
        });

        it('should get data attribute', () => {
            container.dataset.test = 'value';
            expect(component['getData']('test')).toBe('value');
        });
    });

    describe('Event Handling', () => {
        it('should add and remove event listener', () => {
            const handler = jest.fn();
            component['on']('click', handler);
            container.click();
            expect(handler).toHaveBeenCalled();

            component['off']('click', handler);
            container.click();
            expect(handler).toHaveBeenCalledTimes(1);
        });

        it('should emit custom event', () => {
            const handler = jest.fn();
            container.addEventListener('custom-event', handler);
            component['emit']('custom-event', { detail: 'test' });
            expect(handler).toHaveBeenCalled();
            const event = handler.mock.calls[0][0] as CustomEvent;
            expect(event.detail).toBe('test');
        });
    });
});
