import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute  } from "@angular/router";
import { SpotifyService } from "../services/spotify.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
