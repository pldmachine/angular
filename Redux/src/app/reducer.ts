import { ReduxAction } from "app/redux-action";

export interface Reducer<T> {
    (state: T, action: ReduxAction): T;
}
