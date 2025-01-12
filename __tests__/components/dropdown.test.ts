import Dropdown from '../../js/src/components/dropdown';

describe('Dropdown Component', () => {
  let dropdownElement: HTMLDivElement;
  let dropdown: Dropdown;

  beforeEach(() => {
    dropdownElement = document.createElement('div');
    dropdownElement.classList.add('cl-dropdown');
    dropdownElement.id = 'testDropdown';
    document.body.appendChild(dropdownElement);
    dropdown = new Dropdown(dropdownElement);
  });

  afterEach(() => {
    document.body.removeChild(dropdownElement);
  });

  it('should create a Dropdown instance', () => {
    expect(dropdown).toBeTruthy();
  });

  it('should have default options', () => {
    expect(dropdown['options'].placement).toBe('bottom');
    expect(dropdown['options'].rtl).toBe(false);
  });

  it('should add dropdown classes', () => {
    expect(dropdownElement.classList.contains('cl-dropdown')).toBeTruthy();
  });
});
