import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable } from "rxjs";
import { ThreadService } from "../services/threads.service";
import { Thread } from "../model/thread.model";

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.css']
})
export class ChatThreadComponent implements OnInit {
  @Input() thread: Thread;
  selected = false;
  constructor(public threadService: ThreadService) { }

  ngOnInit() {
    this.threadService.currentThread
      .subscribe((currentThread: Thread) => {
        this.selected = currentThread && this.thread && (currentThread.id === this.thread.id);
      });
  }

  clicked(event: any): void {
    this.threadService.setCurrentThread(this.thread);
    event.preventDefault();
  }

}
