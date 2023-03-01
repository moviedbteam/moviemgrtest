import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { WatchesModel } from '../shared/models/watches.model';

@Injectable({
  providedIn: 'root'
})
export class WatchService {

  apiBack = environment.base_url_apiBack;
  apiPostWatchMovie:string = '/watch/movie';
  apiGetWatchMovies:string = '/watch/movie/all';
  private _watches$:BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    private http:HttpClient,
  ) { console.log(this._watches$);}

  getWatchMoviesFromApi() {

    console.log(this.apiBack+this.apiGetWatchMovies);
    this.http.get(this.apiBack+this.apiGetWatchMovies)

    .pipe(
      map((apiResponse:any) => {
        return apiResponse.map( (watch: any) => new WatchesModel(watch) )
      })
    )
    
    .subscribe((watches:WatchesModel[]) => {
      console.log ("watches mappés : ", watches)
      let actualWatches = this._watches$.getValue();
      let allWatches:any = [...actualWatches, ...watches]

      this._watches$.next(allWatches);
    });    
  }
  
  getWatches$ ():Observable<WatchesModel[]> {
    return this._watches$.asObservable();
  }
  
  postWatchMovieToApi(postWatchMovie: any) {
    console.log(postWatchMovie);  
    return this.http.post(this.apiBack+this.apiPostWatchMovie, postWatchMovie, {observe: 'response', responseType: 'text'} );
  }
}
