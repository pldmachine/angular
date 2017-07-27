import { Component } from '@angular/core';
import { Action, Reducer, Store, createStore } from "redux";
import { AppState } from "app/app-state";
import { AddMessageAction } from "app/add-message-action";
import { DeleteMessageAction } from "app/delete-message-action";
import { MessageActions } from "app/message-actions";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {

    let initialState: AppState = { messages: [] };


    let reducer: Reducer<AppState> = (state: AppState = initialState, action: Action): AppState => {

      switch (action.type) {
        case 'ADD_MESSAGE':
          return {
            messages: state.messages.concat((<AddMessageAction>action).message),
          };
        case 'DELETE_MESSAGE':
          let idx = (<DeleteMessageAction>action).index;
          return {
            messages: [
              ...state.messages.slice(0, idx),
              ...state.messages.slice(idx + 1, state.messages.length)
            ]
          };
        default:
          return state;
      }
    }

    let store:Store<AppState> = createStore<AppState>(reducer);
    console.log(store.getState());

    store.dispatch(MessageActions.addMessage('Message1'));
    store.dispatch(MessageActions.addMessage('Message2'));
    store.dispatch(MessageActions.addMessage('Message3'));

    console.log(store.getState());

    store.dispatch(MessageActions.deleteMessage(1));

    console.log(store.getState());

    // let unsubscribe = store.subscribe(()=>{
    //   console.log('subscribed: ', store.getState());
    // });


    // store.dispatch({ type: 'INCREMENT'});


    // console.log(store.getState());
  }

}
