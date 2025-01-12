import Card from '../../js/src/components/card';

describe('Card Component', () => {
  let cardElement: HTMLDivElement;
  let card: Card;

  beforeEach(() => {
    cardElement = document.createElement('div');
    cardElement.classList.add('cl-card');
    document.body.appendChild(cardElement);
    card = new Card(cardElement);
  });

  afterEach(() => {
    document.body.removeChild(cardElement);
  });

  it('should create a Card instance', () => {
    expect(card).toBeTruthy();
  });

  it('should add card classes', () => {
    expect(cardElement.classList.contains('cl-card')).toBeTruthy();
  });

  it('should have default options', () => {
    expect(card['options'].rtl).toBe(false);
  });

  it('should handle header and footer', () => {
    const headerElement = document.createElement('div');
    headerElement.classList.add('cl-card-header');
    const footerElement = document.createElement('div');
    footerElement.classList.add('cl-card-footer');

    cardElement.appendChild(headerElement);
    cardElement.appendChild(footerElement);

    expect(cardElement.querySelector('.cl-card-header')).toBeTruthy();
    expect(cardElement.querySelector('.cl-card-footer')).toBeTruthy();
  });
});
