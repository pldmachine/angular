import { Component, OnInit, EventEmitter, Output, ElementRef } from '@angular/core';
import { SearchResult } from '../../youtube/model/search-result.model';
import { YouTubeSearchService } from '../../youtube/services/youtube-search.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-search-box',
  template: `<input type="text" class="form-control" placeholder="Search" autofocus> `,
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  @Output() loading: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() results: EventEmitter<SearchResult[]> = new EventEmitter<SearchResult[]>();

  constructor(private youtube: YouTubeSearchService, private el: ElementRef) { }

  ngOnInit(): void {
    Observable.fromEvent(this.el.nativeElement,'keyup')
    .map((e:any) => e.target.value)
    .filter((text:string)=> text.length>1)
    .debounceTime(250)
    .do(()=>this.loading.emit(true))
    .map((query: string) => this.youtube.search(query))
    .switch()
    .subscribe(
      (result: SearchResult[]) => {
        this.loading.emit(false),
        this.results.emit(result)
      },
      (err: any) => {
        console.log(err);
        this.loading.emit(false);
      },
      ()=>{
        this.loading.emit(false);
      }

    );
  }

}
