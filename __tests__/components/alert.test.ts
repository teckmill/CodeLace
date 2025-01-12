import Alert from '../../js/src/components/alert';

describe('Alert Component', () => {
  it('should create an Alert instance', () => {
    const alertElement = document.createElement('div');
    const alert = new Alert({ element: alertElement });
    expect(alert).toBeTruthy();
  });
});
