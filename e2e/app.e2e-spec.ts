import { InventoryPage } from './app.po';

describe('inventory App', () => {
  let page: InventoryPage;

  beforeEach(() => {
    page = new InventoryPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
