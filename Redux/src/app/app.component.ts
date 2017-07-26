import { Component } from '@angular/core';
import { Reducer } from "./reducer";
import { Store } from "app/store";
import { AppState } from "app/app-state";
import { ReduxAction } from "app/redux-action";



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  constructor() {

    let incrementAction: ReduxAction = { type: 'INCREMENT' }
    let decrementAction: ReduxAction = { type: 'DECREMENT' }


    let reducer: Reducer<AppState> = (state: AppState, action: ReduxAction): AppState => {
      switch (action.type) {
        case 'ADD_MESSAGE':
          return {


          }

      }

      return state;
    }

    // let store = new Store<number>(reducer,0);

    // let unsubscribe = store.subscribe(()=>{
    //   console.log('subscribed: ', store.getState());
    // });


    // store.dispatch({ type: 'INCREMENT'});


    // console.log(store.getState());
  }

}
