import Modal from '../../js/src/components/modal';

describe('Modal Component', () => {
  let modalElement: HTMLDivElement;
  let modal: Modal;

  beforeEach(() => {
    modalElement = document.createElement('div');
    modalElement.classList.add('cl-modal');
    modalElement.id = 'testModal';
    document.body.appendChild(modalElement);
    modal = new Modal(modalElement);
  });

  afterEach(() => {
    document.body.removeChild(modalElement);
  });

  it('should create a Modal instance', () => {
    expect(modal).toBeTruthy();
  });

  it('should have default options', () => {
    expect(modal['options'].keyboard).toBe(true);
    expect(modal['options'].backdrop).toBe(true);
    expect(modal['options'].focus).toBe(true);
  });

  it('should add modal classes', () => {
    expect(modalElement.classList.contains('cl-modal')).toBeTruthy();
  });
});
