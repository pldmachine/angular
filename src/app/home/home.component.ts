import { Component, OnInit } from '@angular/core';
import { Observable, Observer } from 'rxjs';




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
    this.example4();

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

  onNext(value) {    
    let circle = document.getElementById("circle");
    circle.style.left = value.x;
    circle.style.top = value.y;

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
