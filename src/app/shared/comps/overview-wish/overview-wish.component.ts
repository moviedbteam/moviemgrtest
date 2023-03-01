import { Component, ViewEncapsulation } from '@angular/core';
import { MovieService } from 'src/app/services/movie.service';
import { WishService } from 'src/app/services/wish.service';
import { MovieModel } from '../../models/movie.model';
import { WishesModel } from '../../models/wishes.model';

@Component({
  selector: 'app-overview-wish',
  templateUrl: './overview-wish.component.html',
  styleUrls: ['./overview-wish.component.css'],
  encapsulation: ViewEncapsulation.None,
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // changeDetection: ChangeDetectionStrategy.Default,
})
export class OverviewWishComponent {

  wishMovies:Array<WishesModel> = [];
  subscriptionWishes:any;

  moviesWish:Array<MovieModel>=[];
  subscriptionMovieWish:any;

  constructor(
    private wishSvc:WishService,
    public movieSvcWish:MovieService,
  )
  {
    console.log(this)
  }

  ngOnInit() {
    this.subscriptionWishes = this.wishSvc.getWishes$()
      .subscribe(
        (wishesArr:WishesModel[]) => {

          if(wishesArr.length===0) {
            this.wishSvc.getWishMoviesFromApi();
          }
          
          this.wishMovies = wishesArr
          console.log("this.wishMovies");
          console.log(this.wishMovies);

          let boucle = 1;
          for (let wish of this.wishMovies) {
            this.movieSvcWish.getDetailsWishFromApi(wish.idMovie);
            console.log("boucle "+boucle);
            boucle++;
          }

        }
      );
    
    this.subscriptionMovieWish = this.movieSvcWish.getMovieWishDetail$()
      .subscribe(
        (movieWish:MovieModel) => {      
          this.moviesWish.push(movieWish);

          console.log("movieWish");
          console.log(movieWish);
          console.log("this.moviesWish");
          console.log(this.moviesWish);
          
        }
      );


  }

  getImgFullUrl(urlFragment:string):string {
    // https://image.tmdb.org/t/p/w500/faXT8V80JRhnArTAeYXz0Eutpv9.jpg
    return "https://image.tmdb.org/t/p/w500"+urlFragment;
  }

  ngOnDestroy() {
    console.log(this.wishMovies);

    this.subscriptionWishes.unsubscribe();
    this.subscriptionMovieWish.unsubscribe();
  }

}
