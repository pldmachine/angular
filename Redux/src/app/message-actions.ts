import { AddMessageAction } from "app/add-message-action";
import { DeleteMessageAction } from "app/delete-message-action";

export class MessageActions {
    static addMessage(message: string): AddMessageAction{
        return{
            type: 'ADD_MESSAGE',
            message: message
        };
    }
    static deleteMessage(index: number): DeleteMessageAction{
        return{
            type: 'ADD_MESSAGE',
            index: index
        };
    }
}

