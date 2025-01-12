import Collapse from '../../js/src/components/collapse';

describe('Collapse Component', () => {
  let collapseElement: HTMLDivElement;
  let collapse: Collapse;

  beforeEach(() => {
    collapseElement = document.createElement('div');
    collapseElement.classList.add('cl-collapse');
    collapseElement.id = 'testCollapse';
    document.body.appendChild(collapseElement);
    collapse = new Collapse({ element: collapseElement });
  });

  afterEach(() => {
    document.body.removeChild(collapseElement);
  });

  it('should create a Collapse instance', () => {
    expect(collapse).toBeTruthy();
  });

  it('should have default options', () => {
    expect(collapse['options'].parent).toBeNull();
    expect(collapse['options'].toggle).toBe(true);
  });

  it('should add collapse classes', () => {
    expect(collapseElement.classList.contains('cl-collapse')).toBeTruthy();
  });

  it('should set initial display to none', () => {
    expect(collapseElement.style.display).toBe('none');
  });
});
