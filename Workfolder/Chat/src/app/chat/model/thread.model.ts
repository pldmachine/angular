import { Message } from "../model/message.model";
import { uuid } from "../util/uuid";

export class Thread {
    id: string;
    lastMessage: Message;
    name: string;
    avatarSrc: string;

    constructor(id?: string, name?: string, avatarScr?: string)
    {
        this.id = id || uuid();
        this.name = name;
        this.avatarSrc = avatarScr;
    }
}

