import { Component, OnInit, Injectable } from '@angular/core';
import * as _ from "lodash";
import { Message } from "../model/message.model";
import { Thread } from "../model/thread.model";

import { MessagesService } from "../services/messages.service";
import { ThreadService } from "../services/threads.service";


@Component({
  selector: 'app-chat-nav-bar',
  templateUrl: './chat-nav-bar.component.html',
  styleUrls: ['./chat-nav-bar.component.css']
})
export class ChatNavBarComponent implements OnInit {
  unreadMessagesCount: number;
  constructor(public messagesService: MessagesService, public threadsService: ThreadService) { }

  ngOnInit() {
    this.messagesService.messages
      .combineLatest(this.threadsService.currentThread, (messages: Message[], currentThread: Thread) => [currentThread, messages])
      .subscribe(([currentThread, messages]: [Thread, Message[]]) => {
        this.unreadMessagesCount = _.reduce(
          messages,
          (sum: number, m: Message) => {
            const messageIsInCurrentThread: boolean = m.thread && currentThread && (currentThread.id === m.thread.id);
            if (m && !m.isRead && !messageIsInCurrentThread) {
              sum = sum + 1;
            }
            return sum;
          }, 0
        );
      })
  }

}
