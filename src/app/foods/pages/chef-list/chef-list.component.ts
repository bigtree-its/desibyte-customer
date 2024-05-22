import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
  inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { faArrowLeft, faCheck, faCopyright, faStar } from '@fortawesome/free-solid-svg-icons';
import { Subject, takeUntil } from 'rxjs';
import { Cuisine, Dish, LocalChef, LocalChefSearchQuery } from 'src/app/model/all-foods';
import { PostcodeDistrict, ServiceLocation } from 'src/app/model/common';
import { Constants } from 'src/app/services/common/constants';
import { LocalService } from 'src/app/services/common/local.service';
import { LocationService } from 'src/app/services/common/location.service';
import { Utils } from 'src/app/services/common/utils';
import { ChefService } from 'src/app/services/foods/chef.service';
import { CuisinesService } from 'src/app/services/foods/cusines.service';
import { DishService } from 'src/app/services/foods/dish.service';



@Component({
  selector: 'app-chef-list',
  templateUrl: './chef-list.component.html',
  styleUrls: ['./chef-list.component.css'],
})
export class ChefListComponent implements OnDestroy {
  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent: ElementRef<any>;

  localService = inject(LocalService);
  dishService = inject(DishService);
  titleService = inject(Title);

  destroy$ = new Subject<void>();
  serviceLocation: ServiceLocation;
  localChefs: LocalChef[] = [];
  filteredChefs: LocalChef[] = [];
  serviceLocations: ServiceLocation[] = [];

  starSelected: string = '/assets/icons/star3.png';
  star: string = '/assets/icons/star.png';
  cuisines: Cuisine[] = [];
  selectedCuisines: Cuisine[] = [];
  selectedDishes: Dish[] = [];
  selectedCuisine: Cuisine;
  selectedDish: Dish;
  cuisineMap: Map<String, Cuisine> = new Map<String, Cuisine>();
  dishMap: Map<String, Dish> = new Map<String, Dish>();
  errors: any;
  errorMessage: any;
  dishes: Dish[] = [];
  cuisine: Cuisine;
  faStar = faStar;
  faCopyright = faCopyright;
  faCheck = faCheck;
  faArrowLeft = faArrowLeft;

  areaQuery: string;
  cuisineQuery: string;
  postcodeDistrict: PostcodeDistrict;
  invalidPostcodeDistrict: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private chefService: ChefService,
    private locationService: LocationService,
    private cuisinesService: CuisinesService,
    private router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.areaQuery = params['area'];
      this.cuisineQuery = params['cuisine'];
    });
    this.cuisinesService.getCuisines().subscribe((d) => {
      if ( d){
        this.cuisines = d;
        for (var i = 0; i < d.length; i++) {
          var theCuisine = d[i];
          this.cuisineMap.set(theCuisine.name, theCuisine);
        }
        if (this.cuisineQuery) {
          this.cuisinesService.getSingleCuisine(this.cuisineQuery).subscribe((c) => {
            if (Utils.isValid(c)) {
              this.cuisine = c;
              console.log('Fetched the cuisine ' + JSON.stringify(this.cuisine));
              this.fetchChefsByCuisines(this.cuisine);
            }
          });
        }
      }
     
    });
    // var location = this.activatedRoute.snapshot.queryParamMap.get('location');
    // const cuisine = this.activatedRoute.snapshot.queryParamMap.get('cuisine');
    console.log('location: ' + this.areaQuery);
    console.log('cuisine: ' + this.cuisineQuery);
    if (this.areaQuery) {
      this.getChefs();
    }
    this.loadDishes();
  }

  private getChefs() {
    var params = this.areaQuery.split("-");
    var prefix = params[0];
    var area = params[1];
    this.locationService.fetchPostcodeDistricts(prefix, null).subscribe((pd) => {
      if (Utils.isValid(pd)) {
        this.postcodeDistrict = pd[0];
        this.fetchChefsByPostcodeDistrict(this.postcodeDistrict);
        this.titleService.setTitle("Home Chefs in "+this.postcodeDistrict.area+", "+ this.postcodeDistrict.prefix.toUpperCase());
        this.localService.saveData(Constants.StorageItem_Location, JSON.stringify(this.postcodeDistrict));
        this.fetchChefsByPostcodeDistrict(this.postcodeDistrict);
      }else{
        this.invalidPostcodeDistrict = true;
      }
    });
  }

  goBack() {
    this._location.back();
  }


  private loadDishes() {
    let observable = this.dishService.getDishes();
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        console.log('Retrieved dishes from server');
        this.dishes = data;
      },
      error: (err) => {
        console.error('Errors when loading Dishes' + JSON.stringify(err));
        this.errors = err;
        this.errorMessage = err.error.detail;
      },
    });
  }

  onSelectCuisine(c: Cuisine) {
    console.log('You clicked ' + JSON.stringify(c));
    var selected = false;
    for (var i = 0; i < this.selectedCuisines.length; i++) {
      var theCuisine = this.selectedCuisines[i];
      if (theCuisine.name === c.name) {
        this.selectedCuisines.splice(i, 1);
        selected = true;
      }
    }
    this.filteredChefs = [];
    if (!selected) {
      this.selectedCuisines.push(c);
    }

    this.filterByCuisine();
  }

  isSelectedCuisine(c: Cuisine) {
    var selected = false;
    for (var i = 0; i < this.selectedCuisines.length; i++) {
      var theCuisine = this.selectedCuisines[i];
      if (theCuisine.name === c.name) {
        selected = true;
        console.log('Cuisine selected ' + true);
        break;
      }
    }
    return selected;
  }

  filterByCuisine() {
    console.log('Selected cuisines: ' + JSON.stringify(this.selectedCuisines));
    if (this.selectedCuisines.length === 0) {
      this.filteredChefs = this.localChefs;
    } else {
      this.localChefs.forEach((supplier) => {
        this.selectedCuisines.forEach((selectedC) => {
          supplier.cuisines.forEach((supplierC) => {
            if (selectedC.name === supplierC.name) {
              if (!this.filteredChefs.includes(supplier)) {
                this.filteredChefs.push(supplier);
              }
            }
          });
        });
      });
    }
  }

  onSelectDish(c: Dish) {
    console.log('You clicked dish' + JSON.stringify(c));
    var selected = false;
    for (var i = 0; i < this.selectedDishes.length; i++) {
      var theDish = this.selectedDishes[i];
      if (theDish.name === c.name) {
        this.selectedDishes.splice(i, 1);
        selected = true;
      }
    }
    this.filteredChefs = [];
    if (!selected) {
      this.selectedDishes.push(c);
    }

    this.filterByDish();
  }

  isDishSelected(c: Dish) {
    var selected = false;
    for (var i = 0; i < this.selectedDishes.length; i++) {
      var theDish = this.selectedDishes[i];
      if (theDish.name === c.name) {
        selected = true;
        console.log('Dish selected? ' + true);
        break;
      }
    }
    return selected;
  }

  filterByDish() {
    console.log('Chefs: ' + JSON.stringify(this.localChefs));
    console.log('Selected dish: ' + JSON.stringify(this.selectedDishes));
    if (this.selectedDishes.length === 0) {
      this.filteredChefs = this.localChefs;
    } else {
      this.localChefs.forEach((supplier) => {
        this.selectedDishes.forEach((selectedD) => {
          supplier.dishes.forEach((sd) => {
            if (selectedD.name === sd.name) {
              if (!this.filteredChefs.includes(supplier)) {
                this.filteredChefs.push(supplier);
              }
            }
          });
        });
      });
    }
  }

  onClickCook(cook: LocalChef) {
    this.router.navigate(['cooks', cook._id]).then();
  }

  fetchChefsByPostcodeDistrict(postcodeDistrict: PostcodeDistrict) {
    const chefSearchQuery = {} as LocalChefSearchQuery;
    chefSearchQuery.postcodeDistricts = postcodeDistrict._id;
    this.chefService
      .getAllLocalChefs(chefSearchQuery)
      .subscribe((result: LocalChef[]) => {
        this.localChefs = result;
        this.filteredChefs = this.localChefs;
      });
  }

  fetchChefsByCuisines(cuisine: Cuisine) {
    const chefSearchQuery = {} as LocalChefSearchQuery;
    chefSearchQuery.cuisines = cuisine._id;
    console.log('The Query for chefs ' + JSON.stringify(chefSearchQuery));
    this.chefService
      .getAllLocalChefs(chefSearchQuery)
      .subscribe((result: LocalChef[]) => {
        this.localChefs = result;
        this.filteredChefs = this.localChefs;
        this.serviceLocations = [];
      });
  }

  getAddress(cook: LocalChef): string {
    return Utils.getChefAddress(cook);
  }

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft + 150,
      behavior: 'smooth',
    });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({
      left: this.widgetsContent.nativeElement.scrollLeft - 150,
      behavior: 'smooth',
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
