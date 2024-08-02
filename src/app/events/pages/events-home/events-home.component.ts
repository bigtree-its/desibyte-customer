import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { faChampagneGlasses } from '@fortawesome/free-solid-svg-icons';
import { AdsService } from 'src/app/services/ads/ads.service';

@Component({
  selector: 'app-events-home',
  templateUrl: './events-home.component.html',
  styleUrls: ['./events-home.component.css']
})
export class EventsHomeComponent implements OnInit,OnDestroy{
 
  faLogo = faChampagneGlasses;
  adService = inject(AdsService);
  
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }



}
