import { Thread } from "app/thread/thread.model";
import { User } from "app/user/user.model";

export interface Message {
    id?: string;
    sentAt?: Date;
    isRead?: boolean;
    thread?: Thread;
    author: User;
    text: string;
}
