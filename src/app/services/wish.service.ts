import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { WishesModel } from '../shared/models/wishes.model';

@Injectable({
  providedIn: 'root'
})
export class WishService {

  apiBack = environment.base_url_apiBack;
  apiPostWishMovie:string = '/wish/movie';
  apiGetWishMovies:string = '/wish/movie/all';
  private _wishes$:BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(
    private http:HttpClient,
  ) { console.log(this._wishes$); }

  getWishMoviesFromApi() {
    
    console.log(this.apiBack+this.apiGetWishMovies);
    this.http.get(this.apiBack+this.apiGetWishMovies)
    
    .pipe(
      map((apiResponse:any) => {
        return apiResponse.map( (wish: any) => new WishesModel(wish) )
      })
    )

    .subscribe((wishes:WishesModel[]) => {
      console.log ("wishes mappés : ", wishes)
      let actualWishes = this._wishes$.getValue();
      let allWishes:any = [...actualWishes, ...wishes]
      this._wishes$.next(allWishes);
    });
  }

  getWishes$ ():Observable<WishesModel[]> {
    return this._wishes$.asObservable();
  }

  postWishMovieToApi(postWishMovie: any) {
    console.log(postWishMovie);  
    return this.http.post(this.apiBack+this.apiPostWishMovie, postWishMovie, {observe: 'response', responseType: 'text'});
  }

}