import { Component, OnInit } from '@angular/core';
import { Observable, Observer, Subject } from 'rxjs';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
 

  constructor() {
    


    //this.example1();
    // this.example2();
    // console.log("before");
    // //this.example3();
    // console.log("after");
    this.example5();

  }

  example1() {
    let numbers = [1, 3, 5, 8, 9];
    let source = Observable.from(numbers)
    source.subscribe(new MyObserver());

  }

  example2() {
    
    let numbers = [1, 3, 5, 8, 9];
    let source = Observable.create(observer => {
      for (let n of numbers) {
        observer.next(n);
      }

      observer.complete();
    })
  }

  example3() {
    let numbers = [1, 3, 5, 8, 9];
    let source = Observable.create(observer => {

      let index = 0;
      let produceValue = () => {
        observer.next(numbers[index++]);

        if (index < numbers.length) {
          setTimeout(produceValue, 250);
        }
        else {
          observer.complete();
        }
      }

      produceValue();

    }).map(n => n * 2)
      .filter(n => n > 10);

    source.subscribe(
      value => console.log(`value: ${value}`),
      e => console.log(`error: ${e}`),
      () => console.log("complete")
    );
  }

  example4() {
    let source = Observable.fromEvent(document, "mousemove")
      .map(
      (e: MouseEvent) => {
        return {
          x: e.clientX,
          y: e.clientY
        }
      }
      );

    source.subscribe(
      this.onNext,
      e => console.log(`error: ${e}`),
      () => console.log("complete")
    );
  }

example5()
{
  var subject = new Subject();
  subject.subscribe(v=>console.log(`consumer a: ${v}`));
  subject.subscribe(v=>console.log(`consumer b: ${v}`));

  subject.next("1");
  subject.next("2");

  var observable = Observable.from([3,4]);
  

  
}


  onNext(value) {    
    let circle = document.getElementById("circle");
  }

  ngOnInit() {
  }

}

class MyObserver {
  next(value) {
    console.log(`value: ${value}`);
  }
  error(e) {
    console.log(`error: ${e}`);
  }

  complete() {
    console.log("complete");
  }
}
