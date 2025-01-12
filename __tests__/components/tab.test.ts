import { Tab } from '../../js/src/components/tab';

describe('Tab Component', () => {
  let tabContainerElement: HTMLDivElement;
  let tab: Tab;

  beforeEach(() => {
    tabContainerElement = document.createElement('div');
    tabContainerElement.classList.add('cl-tabs');
    
    // Create tab navigation
    const tabNav = document.createElement('ul');
    
    // Create tab content
    const tabContent = document.createElement('div');
    
    // Create sample tabs
    const tab1 = document.createElement('li');
    tab1.setAttribute('data-cl-toggle', 'tab');
    tab1.setAttribute('data-cl-target', '#tab1');
    
    const tab2 = document.createElement('li');
    tab2.setAttribute('data-cl-toggle', 'tab');
    tab2.setAttribute('data-cl-target', '#tab2');
    
    const tabPane1 = document.createElement('div');
    tabPane1.id = 'tab1';
    
    const tabPane2 = document.createElement('div');
    tabPane2.id = 'tab2';
    
    tabNav.appendChild(tab1);
    tabNav.appendChild(tab2);
    
    tabContent.appendChild(tabPane1);
    tabContent.appendChild(tabPane2);
    
    tabContainerElement.appendChild(tabNav);
    tabContainerElement.appendChild(tabContent);
    
    document.body.appendChild(tabContainerElement);
    
    tab = new Tab(tabContainerElement);
  });

  afterEach(() => {
    document.body.removeChild(tabContainerElement);
  });

  it('should create a Tab instance', () => {
    expect(tab).toBeTruthy();
  });

  it('should add tab classes', () => {
    expect(tabContainerElement.classList.contains('cl-tabs')).toBeTruthy();
  });

  it('should have default options', () => {
    expect(tab['options'].activeTab).toBe('');
    expect(tab['options'].rtl).toBe(false);
  });
});
