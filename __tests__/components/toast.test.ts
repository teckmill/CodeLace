import Toast from '../../js/src/components/toast';

describe('Toast Component', () => {
  let toastElement: HTMLDivElement;
  let toast: Toast;

  beforeEach(() => {
    toastElement = document.createElement('div');
    toastElement.classList.add('cl-toast');
    toastElement.id = 'testToast';
    document.body.appendChild(toastElement);
    toast = new Toast({ element: toastElement });
  });

  afterEach(() => {
    document.body.removeChild(toastElement);
  });

  it('should create a Toast instance', () => {
    expect(toast).toBeTruthy();
  });

  it('should have default options', () => {
    expect(toast['options'].animation).toBe(true);
    expect(toast['options'].autohide).toBe(true);
    expect(toast['options'].delay).toBe(5000);
  });

  it('should add toast classes', () => {
    expect(toastElement.classList.contains('cl-toast')).toBeTruthy();
  });
});
