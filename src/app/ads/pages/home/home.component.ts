import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  faBed,
  faFilter,
  faHome,
  faSort,
  faTag,
} from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { AdSearchQuery, PropertyAd } from 'src/app/model/all-ads';
import { AdsService } from 'src/app/services/ads/ads.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<void>();

  adService = inject(AdsService);
  modalService = inject(NgbModal);

  location: string;
  category: string;
  propertyType: string;
  consumptionType: string;
  minAmount: number;
  maxAmount: number;
  minBed: number;
  maxBed: number;
  properties: PropertyAd[] = [];

  faFilter = faFilter;
  faSort = faSort;
  faTag = faTag;
  faBed = faBed;
  faHome = faHome;

  ngOnInit(): void {
    var query: AdSearchQuery = {};
    // query.reference = "k6mdbo20e";

    this.adService.getProperties(query).subscribe((d) => {
      this.properties = d;
      console.log('Result ' + JSON.stringify(this.properties));
    });
  }

  onChangeLocation(e: any) {
    this.location = e.target.value;
  }
  onChangeCategory(e: any) {
    this.category = e.target.value;
  }

  onChangePropertyTypeList(e:any){
    this.propertyType = e.target.value;
  }

  onChangeConsumptionType(e:any){
    this.consumptionType = e.target.value;
  }


  selectPropertyType(evt: any) {
    this.propertyType = evt.target.value;
  }

  openModal(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'custom-class',
      })
      .result.then(
        (result) => { },
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  close() {
    this.modalService.dismissAll();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
