import { Action } from "app/action";

export interface DeleteMessageAction extends Action {
    index: number;
}
