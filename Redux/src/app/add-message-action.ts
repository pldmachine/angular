import { ReduxAction } from "app/redux-action";

export interface AddMessageAction extends ReduxAction {
    message: string;
}
