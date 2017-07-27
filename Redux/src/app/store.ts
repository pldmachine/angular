import { Reducer } from "app/reducer";
import { ListenerCallback } from "app/listener-callback";
import { UnsubscribeCallback } from "app/unsubscribe-callback";
import { ReduxAction } from "app/redux-action";

export class Store<T> {
    private _state: T;
    private _listeners: ListenerCallback[] = [];

    constructor(private reducer: Reducer<T>, initialState: T) {
        this._state = initialState;
    }

    getState(): T {
        return this._state;
    }

    dispatch(action: ReduxAction): void {
        this._state = this.reducer(this._state, action);
        this._listeners.forEach((listener: ListenerCallback)=> listener());
    }

    subscribe(listener: ListenerCallback): UnsubscribeCallback
    {
        this._listeners.push(listener);
        return () =>{
            this._listeners = this._listeners.filter(l=>l!==listener);
        }
    }
}
