import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { faClose, faLocation, faSearch } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Cuisine } from 'src/app/model/all-foods';
import { ServiceLocation } from 'src/app/model/common';
import { LocationService } from 'src/app/services/common/location.service';
import { Utils } from 'src/app/services/common/utils';
import { CuisinesService } from 'src/app/services/foods/cusines.service';

@Component({
  selector: 'app-foods-home',
  templateUrl: './foods-home.component.html',
  styleUrls: ['./foods-home.component.css']
})
export class FoodsHomeComponent implements OnInit{
 

  faLocation = faLocation;
  faSearch = faSearch;
  faClose = faClose;

  router = inject(Router);
  cuisinesService = inject(CuisinesService);
  modalService = inject(NgbModal);
  locationService = inject(LocationService);
  serviceLocations: ServiceLocation[];
  showServiceLocations: boolean;
  serviceLocationSearchText: any;
  selectedServiceLocation: ServiceLocation;

  popularLocations: ServiceLocation[];
  cuisines: Cuisine[] = [];
  cuisineMap: Map<String, Cuisine> = new Map<String, Cuisine>();

  ngOnInit(): void {
    this.fetchAllServiceAreas();
    this.fetchPopularLocations('Glasgow');
    this.cuisinesService.getCuisines().subscribe((d) => {
      this.cuisines = d;
      for (var i = 0; i < d.length; i++) {
        var theCuisine = d[i];
        this.cuisineMap.set(theCuisine.name, theCuisine);
      }
    });
  }

  fetchPopularLocations(searchString: string) {
    if (searchString === null && searchString === undefined) {
      return;
    }
    this.locationService
      .fetchLocalAreas(searchString.trim())
      // .pipe(first())
      .subscribe(
        (data: ServiceLocation[]) => {
          this.popularLocations = data;
        },
        (error) => {
          console.log(
            'Popular Locations Lookup resulted an error.' +
            JSON.stringify(error)
          );
        }
      );
  }


  fetchAllServiceAreas() {
    this.locationService
      .fetchLocalAreas('Glasgow')
      // .pipe(first())
      .subscribe(
        (data: ServiceLocation[]) => {
          this.serviceLocations = data;
          this.showServiceLocations = true;
          console.log(
            'The service location List: ' +
            JSON.stringify(this.showServiceLocations)
          );
        },
        (error) => {
          console.log(
            'Address Lookup resulted an error.' + JSON.stringify(error)
          );
        }
      );
  }

  lookupServiceLocation(searchString: string, content) {
    if (searchString === null && searchString === undefined) {
      return;
    }
    this.locationService
      .fetchLocalAreas(searchString.trim())
      // .pipe(first())
      .subscribe(
        (data: ServiceLocation[]) => {
          this.serviceLocations = data;
          if ( Utils.isValid(this.serviceLocations)){
            this.open(content);
          }
          this.showServiceLocations = true;
          console.log('The service location List: ' + JSON.stringify(this.serviceLocations)
          );
        },
        (error) => {
          console.log(
            'Address Lookup resulted an error.' + JSON.stringify(error)
          );
        }
      );
  }

  onSelectServiceLocation(selectedServiceLocation: ServiceLocation) {
    this.close();
    this.selectedServiceLocation = selectedServiceLocation;
    // this.fetchChefsByServiceLocation(selectedServiceLocation);
    this.router
      .navigate(['/f/chef-list'], {
        queryParams: { location: selectedServiceLocation.slug },
      })
      .then();
    console.log('Selected location: ' + selectedServiceLocation.name);
  }
  
  onEnter(content) {
    if ( this.serviceLocationSearchText !== undefined){
      this.lookupServiceLocation(this.serviceLocationSearchText, content);
    }
   
  }
  open(content) {
    this.modalService
      .open(content, {
        ariaLabelledBy: 'modal-basic-title',
        windowClass: 'custom-class',
      })
      .result.then(
        (result) => {},
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  closeServiceLocations() {
    this.showServiceLocations = false;
    this.serviceLocationSearchText = undefined;
    this.serviceLocations = [];
  }

  close() {
    this.modalService.dismissAll();
  }

  ngAfterViewInit() { }
}

