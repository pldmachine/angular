import { ReduxPage } from './app.po';

describe('redux App', () => {
  let page: ReduxPage;

  beforeEach(() => {
    page = new ReduxPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
