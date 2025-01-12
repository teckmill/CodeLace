import Button from '../../js/src/components/button';

describe('Button Component', () => {
  let buttonElement: HTMLButtonElement;
  let button: Button;

  beforeEach(() => {
    buttonElement = document.createElement('button');
    buttonElement.classList.add('cl-btn');
    document.body.appendChild(buttonElement);
    button = new Button({ element: buttonElement });
  });

  afterEach(() => {
    document.body.removeChild(buttonElement);
  });

  it('should create a Button instance', () => {
    expect(button).toBeTruthy();
  });

  it('should add button classes', () => {
    expect(buttonElement.classList.contains('cl-btn')).toBeTruthy();
  });

  it('should handle disabled state', () => {
    button = new Button({ 
      element: buttonElement, 
      disabled: true 
    });
    expect(buttonElement.classList.contains('cl-btn-disabled')).toBeTruthy();
  });
});
