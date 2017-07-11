import { Component, OnInit } from '@angular/core';
import { SearchResult } from '../../youtube/model/search-result.model';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
result: SearchResult[];
loading: boolean;

  constructor() { }

  ngOnInit() {
  }

}
