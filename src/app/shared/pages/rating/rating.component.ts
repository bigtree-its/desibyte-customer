import { Component, Input } from '@angular/core';
import { faStar as starReg } from '@fortawesome/free-regular-svg-icons';
import { faStarHalf, faStar as starSolid } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent {


  faStarR = starReg;
  faStarS = starSolid;
  faStarH = faStarHalf;

  @Input() displayReviewDetails?: Boolean = false;
  @Input() rating?: number = 0;
  @Input() totalReviews?: number = 0;

}
