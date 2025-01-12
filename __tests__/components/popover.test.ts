import Popover from '../../js/src/components/popover';

describe('Popover Component', () => {
  let popoverElement: HTMLDivElement;
  let triggerElement: HTMLButtonElement;
  let popover: Popover;

  beforeEach(() => {
    triggerElement = document.createElement('button');
    popoverElement = document.createElement('div');
    
    triggerElement.setAttribute('data-cl-toggle', 'popover');
    popoverElement.classList.add('cl-popover');
    
    document.body.appendChild(triggerElement);
    document.body.appendChild(popoverElement);

    popover = new Popover({ 
      element: popoverElement, 
      content: 'Test Popover Content',
      trigger: 'click'
    });
  });

  afterEach(() => {
    document.body.removeChild(triggerElement);
    document.body.removeChild(popoverElement);
  });

  it('should create a Popover instance', () => {
    expect(popover).toBeTruthy();
  });

  it('should add popover classes', () => {
    expect(popoverElement.classList.contains('cl-popover')).toBeTruthy();
  });

  it('should have default options', () => {
    const defaultPopover = new Popover({ element: popoverElement });
    expect(defaultPopover['options'].placement).toBe('top');
    expect(defaultPopover['options'].trigger).toBe('click');
    expect(defaultPopover['options'].animation).toBe(true);
  });
});
