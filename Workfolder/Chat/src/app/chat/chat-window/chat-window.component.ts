import { Component, OnInit, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { Observable } from "rxjs";
import { User } from "../model/user.model";
import { Message } from "../model/message.model";
import { Thread } from "../model/thread.model";

import { UsersService } from "../services/users.service";
import { MessagesService } from "../services/messages.service";
import { ThreadService } from "../services/threads.service";

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWindowComponent implements OnInit {
  messages: Observable<any>;
  currentThread: Thread;
  draftMessage: Message;
  currentUser: User;

  constructor(public messagesSerivce: MessagesService, public threadService: ThreadService, public usersService: UsersService, public el: ElementRef) { }

  ngOnInit(): void {
    this.messages = this.threadService.currentThreadMessages;
    this.draftMessage = new Message();

    this.threadService.currentThread.subscribe(
      (thread: Thread) => { this.currentThread = thread; }
    );

    this.messages.subscribe(
      (messages: Array<Message>) => {
        setTimeout(() => {
          this.scrollToBottom();
        });
      });

    this.usersService.currentUser.subscribe(
      (user: User) => {
        this.currentUser = user;
      });

  }

  onEnter(event: any): void {
    this.sendMessage();
    event.preventDefault();
  }

  sendMessage(): void {
    const m: Message = this.draftMessage;
    m.author = this.currentUser;
    m.thread = this.currentThread;
    m.isRead = true;
    this.messagesSerivce.addMessage(m);
    this.draftMessage = new Message();

  }

  scrollToBottom(): void {
    const scrollPane: any = this.el.nativeElement.querySelector('.msg-container-base');
    scrollPane.scrollTop = scrollPane.scrollHeight;
  }

}
