import { Component } from '@angular/core';
import * as nlp from "compromise";

@Component({
  selector: 'pm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular: Getting Started';
  query: string = '';
  data: Object;

  constructor() {
   


  }

  submit(query: string): void {

    let s = nlp(query).data();
    this.data = nlp(query).verbs().data();
    console.log(s);
    
  }
}
