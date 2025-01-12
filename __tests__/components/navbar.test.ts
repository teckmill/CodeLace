import Navbar from '../../js/src/components/navbar';

describe('Navbar Component', () => {
  let navbarElement: HTMLElement;
  let navbar: Navbar;

  beforeEach(() => {
    navbarElement = document.createElement('nav');
    navbarElement.classList.add('cl-navbar');
    document.body.appendChild(navbarElement);
    navbar = new Navbar(navbarElement);
  });

  afterEach(() => {
    document.body.removeChild(navbarElement);
  });

  it('should create a Navbar instance', () => {
    expect(navbar).toBeTruthy();
  });

  it('should add navbar classes', () => {
    expect(navbarElement.classList.contains('cl-navbar')).toBeTruthy();
  });

  it('should have default options', () => {
    expect(navbar['options'].rtl).toBe(false);
    expect(navbar['options'].breakpoint).toBe('lg');
    expect(navbar['options'].sticky).toBe(false);
    expect(navbar['options'].fixed).toBeNull();
  });
});
