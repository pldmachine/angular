import { ReduxChatPage } from './app.po';

describe('redux-chat App', () => {
  let page: ReduxChatPage;

  beforeEach(() => {
    page = new ReduxChatPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
