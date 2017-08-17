import { Component, OnInit, Inject } from '@angular/core';
import { Observable } from "rxjs";
import { Thread } from "../model/thread.model";
import { ThreadService } from "../services/threads.service";

@Component({
  selector: 'app-chat-threads',
  templateUrl: './chat-threads.component.html',
  styleUrls: ['./chat-threads.component.css']
})
export class ChatThreadsComponent implements OnInit {
  threads: Observable<any>;

  constructor(public threadService: ThreadService) {
    this.threads = threadService.orderedThreads;
  }

  ngOnInit() {
  }

}
