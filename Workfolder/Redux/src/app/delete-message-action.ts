import { ReduxAction } from "app/redux-action";

export interface DeleteMessageAction extends ReduxAction {
    index: number;
}
