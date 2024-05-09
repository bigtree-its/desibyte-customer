import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { AdSearchQuery, PropertyAd } from 'src/app/model/all-ads';
import { AdsService } from 'src/app/services/ads/ads.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  destroy$ = new Subject<void>();

  adService = inject(AdsService);

  location: string;
  category: string;
  minAmount: number;
  maxAmount: number;
  properties: PropertyAd[] = [];

  ngOnInit(): void {
    var query: AdSearchQuery = {};
    // query.reference = "k6mdbo20e";
    
    this.adService.getProperties(query).subscribe(d=>{
      this.properties = d;
      console.log('Result '+ JSON.stringify(this.properties))
    });
  }

  onChangeLocation(e: any) {
    this.location = e.target.value;
  }
  onChangeCategory(e: any) {
    this.category = e.target.value;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
