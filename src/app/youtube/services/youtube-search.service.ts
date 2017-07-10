import { Injectable, Inject } from '@angular/core'
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export const YOUTUBE_API_KEY: string = "XXX_YOUR_KEY_HERE_XXX";
export const YOUTUBE_API_URL: string = "https://www.googleapis.com/youtube/v3/search";

@Injectable()
export class YouTubeSearchService {
    constructor(private http: Http,
    @Inject(YOUTUBE_API_KEY) private apiKey: string,
    @Inject(YOUTUBE_API_URL) private apiUrl: string   
    )
    {

    }

    search(query: string) : Observable<SearchResult[]>{

    }
}
