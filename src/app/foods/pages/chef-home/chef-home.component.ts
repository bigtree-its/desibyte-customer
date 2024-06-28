import { Location } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Injectable,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import {
  faAngleDown,
  faAngleUp,
  faArrowLeft,
  faArrowRight,
  faBagShopping,
  faBatteryEmpty,
  faBookOpen,
  faCalendar,
  faCommentDots,
  faFaceSmile,
  faHouse,
  faPeopleArrows,
  faStar,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
import {
  NgbAlertModule,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Calendar, CloudKitchen, Collection, FoodOrder, Menu, PartyBundle } from 'src/app/model/all-foods';
import { Review } from 'src/app/model/common';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';
import { ReviewService } from 'src/app/services/common/review.service';
import { Utils } from 'src/app/services/common/utils';
import { CloudKitchenService } from 'src/app/services/foods/cloudkitchen.service';

@Component({
  selector: 'app-chef-home',
  templateUrl: './chef-home.component.html',
  styleUrls: ['./chef-home.component.css'],
})
export class ChefHomeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent: ElementRef<any>;

  ngbEventDate: NgbDateStruct;
  eventTime = { hour: 13, minute: 30 };

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;
  faCalendar = faCalendar;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;
  faBag = faBagShopping;
  faHouse = faHouse;
  faMenu = faBookOpen;
  faComments = faCommentDots;
  faParty = faUserGroup;

  cloudKitchen: CloudKitchen;
  display_picture: any;
  gallery: string[] = [];

  calendars: Calendar[] = [];
  weeklyCals: Calendar[] = [];
  monthlyCals: Calendar[] = [];
  displayCal: boolean = true;
  displayAllDays: boolean = false;
  displayWeeklyCals: boolean = false;
  faStar = faStar;
  faBatteryEmpty = faBatteryEmpty;

  days: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  daysShort: string[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  monthNames: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  monthNamesShort: string[] = [
    'JAN',
    'FEB',
    'MAR',
    'APR',
    'MAY',
    'JUN',
    'JUL',
    'AUG',
    'SEP',
    'OCT',
    'NOV',
    'DEC',
  ];
  items: Menu[] = [];
  items_to_display: Menu[] = [];
  validOrder: boolean = false;
  chefChanged: boolean = false;
  selectedCategory: Collection;
  starSelected: string = '/assets/icons/star2.png';
  star: string = '/assets/icons/star1.png';
  foodOrder: FoodOrder;
  cartTotal: number = 0.0;
  destroy$ = new Subject<void>();
  collections: Collection[];
  activeLayout: string = 'Menu';
  supplierId: any;
  reviews: Review[] = [];
  calendarToDisplay: Calendar;
  incorrectLanding: boolean;
  partyBundles: PartyBundle[];
  minDate = undefined;
  partyOrder: FoodOrder;
  itemsInCart: number = 0;
  eventDate: Date;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: FoodOrderService,
    private cloudKitchenService: CloudKitchenService,
    private reviewService: ReviewService,
    private _location: Location,
    private router: Router,
    private modalService: NgbModal,
    private config: NgbDatepickerConfig
  ) {
    if ( this.ngbEventDate){
      this.eventDate = new Date(
        this.ngbEventDate.year,
        this.ngbEventDate.month - 1,
        this.ngbEventDate.day
      );
    }
   
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit....');
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

  ngOnInit(): void {
   
    this.loadFoodOrder();
    this.loadPartyOrder();

    this.activatedRoute.params.subscribe((params) => {
      this.supplierId = params['id'];
      console.log('Chef-home for supplier ' + this.supplierId);


      let chefObs = this.cloudKitchenService.retrieveKitchen(this.supplierId);
      chefObs.pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          if (!Utils.isValid(data)) {
            this.incorrectLanding = true;
          } else {
            this.cloudKitchen = data;
            this.fetchCollections();
            this.setPartyMinDate();
            this.fetchItems(this.cloudKitchen._id);
            this.fetchCalendars(this.cloudKitchen._id);
            this.fetchReviews(this.cloudKitchen._id);
            if (this.cloudKitchen.doPartyOrders) {
              this.fetchPartyBundles(this.cloudKitchen._id);
            }
          }
        },
        error: (err) => {
          this.incorrectLanding = true;
          console.error(
            'Errors when getting chef from server. ' + JSON.stringify(err)
          );
        },
      });
    });
  }

  private loadFoodOrder() {
    this.orderService.foodOrderSubject$.subscribe({
      next: (value) => {
        console.log('FoodOrderSubject emitted a change ' + JSON.stringify(value));
        if (Utils.isValid(value)) {
          this.foodOrder = value;
          this.summariseOrders();
        }
      },
      error: (err) => console.error('FoodOrderSubject emitted an error: ' + err),
      complete: () => console.log('FoodOrderSubject emitted the complete notification'),
    });
  }

  summariseOrders(){
    var items = 0;
    var total = 0;
    if ( this.foodOrder){
      items = items+ this.foodOrder.items.length;
      total = total+ this.foodOrder.total;
    }
    if ( this.partyOrder){
      items = items+ this.partyOrder.partyItems.length;
      total = total+ this.partyOrder.total;
    }
    this.itemsInCart = items;
    this.cartTotal = total;
    this.cartTotal = +(+this.cartTotal).toFixed(2);
  }

  private loadPartyOrder() {
    this.orderService.partyOrderSubject$.subscribe({
      next: (value) => {
        console.log('PartyOrderRx emitted a change ' + JSON.stringify(value));
        if (Utils.isValid(value)) {
          this.partyOrder = value;
          this.summariseOrders();
          if (this.partyOrder.partyOrder) {
            if (this.partyOrder.partyDate) {
              this.ngbEventDate = {
                year: this.partyOrder.partyDate.getFullYear(),
                month: this.partyOrder.partyDate.getMonth() + 1,
                day: this.partyOrder.partyDate.getDate(),
              };
            }else{
              this.partyOrder.partyDate = this.eventDate;
              this.orderService.updatePartyOrder(this.partyOrder);
            }
          }
        }
      },
      error: (err) => console.error('PartyOrderRx emitted an error: ' + err),
      complete: () => console.log('PartyOrderRx emitted the complete notification'),
    });
  }

  private fetchCollections() {
    let observable = this.cloudKitchenService.getCollections(this.supplierId);
    observable.pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.collections = data;
        this.selectedCategory = null;
      },
      error: (err) => {
        console.error('Errors when getting collections for chef');
      },
    });
  }

  private setPartyMinDate() {
    const current = new Date();
    var futureDate;
    if (this.cloudKitchen && this.cloudKitchen.partyOrderLeadDays > 0) {
      futureDate = this.addDays(current, this.cloudKitchen.partyOrderLeadDays);
    } else {
      futureDate = this.addDays(current, 1);
    }
    this.minDate = {
      year: futureDate.getFullYear(),
      month: futureDate.getMonth() + 1,
      day: futureDate.getDate(),
    };
  }

  fetchPartyBundles(supplierId: string) {
    this.cloudKitchenService
      .getPartyBundleForChef(supplierId)
      .subscribe((partyBundles: PartyBundle[]) => {
        this.partyBundles = partyBundles;
        console.log('PartyBundles fetched: ' + this.partyBundles.length);
      });
  }

  checkOrder() {
    this.orderService.getData();
  }

  writeReview() {
    this.router
      .navigate(['write_review'], {
        queryParams: { chef: this.supplierId },
      })
      .then();
  }
  fetchReviews(supplierId: string) {
    this.reviewService.getReviews(supplierId).subscribe((reviews: Review[]) => {
      this.reviews = reviews;
      console.log('Reviews fetched: ' + this.reviews.length);
    });
  }

  selectLayout(layout: string) {
    this.activeLayout = layout;
    this.close();
  }

  private fetchCalendars(supplierId: string) {
    this.cloudKitchenService
      .getCalendars(supplierId, true, false)
      .subscribe((calendars: Calendar[]) => {
        this.calendars = calendars;
        console.log('Calendars for chef: ' + JSON.stringify(calendars));
      });
  }

  addDays(theDate: Date, days: number): Date {
    return new Date(theDate.getTime() + days * 24 * 60 * 60 * 1000);
  }

  groupCalendar() {
    console.log('Grouping cal');
    this.weeklyCals = [];
    this.monthlyCals = [];
    var date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    var firstDay = new Date(y, m, 1);
    var lastDay = new Date(y, m + 1, 0);

    let today: Date = new Date();
    let dayOfWeekNumber: number = today.getDay();
    let endDays: number = 7 - dayOfWeekNumber;
    var endDate: Date = this.addDays(today, endDays);
    for (var i = 0; i < this.calendars.length; i++) {
      var calendar: Calendar = this.calendars[i];
      if (calendar !== null && calendar !== undefined) {
        let calDate: Date = new Date(calendar.date);
        console.log('Cal Date ' + calDate);
        if (calDate < endDate && calDate > today) {
          this.weeklyCals.push(calendar);
          this.monthlyCals.push(calendar);
        } else if (calDate < lastDay && calDate > firstDay) {
          this.monthlyCals.push(calendar);
        }
      }
    }
    console.log('Weekly Cals: ' + JSON.stringify(this.weeklyCals));
    console.log('Monthly Cals: ' + JSON.stringify(this.monthlyCals));
  }

  private fetchItems(supplierId: string) {
    this.cloudKitchenService.getMenusForKitchen(supplierId).subscribe((items: Menu[]) => {
      this.items = items;
      console.log('Menus fetched: ' + this.items.length);
      if (
        this.collections !== null &&
        this.collections !== undefined &&
        this.collections.length > 0
      ) {
        this.onSelectCategory(this.collections[0]);
      }
    });
  }

  getAddress(): string {
    var address: string = '';
    if (this.cloudKitchen !== null && this.cloudKitchen !== undefined) {
      return Utils.getCloudKitchenAddress(this.cloudKitchen);
    }
    return address;
  }

  filterItemsByCat(category: Collection) {
    this.selectedCategory = category;
    this.items_to_display = [];
    this.items
      .filter((i) => i.collectionId === category._id)
      .forEach((item) => this.items_to_display.push(item));
  }

  isSelectedCategory(category: Collection) {
    if (this.selectedCategory === category) {
      return true;
    }
    return false;
  }

  goback() {
    this._location.back();
  }

  selectCalendar(calendar: Calendar) {
    console.log('Selected calendar ' + calendar.date);
    this.calendarToDisplay = calendar;
  }

  onSelectCategory(category: Collection) {
    this.selectedCategory = category;
    if (this.selectedCategory) {
      if (category.name === 'This Week') {
        this.displayCal = true;
        this.calendarToDisplay = this.calendars[0];
      } else {
        this.filterItemsByCat(category);
        this.displayCal = false;
      }
      console.log('Selected category ' + this.selectedCategory.name)
    }



    // // event.target.style = "border-right: 3px solid #766df4;color: #766df4;text-align: right;";
    // this.categoriesMap.set(category, event.target);
    // this.categoriesMap.forEach((key: string, value: any) => {
    //   if (key !== category) {
    //     value.style = "font-weight: 900;border-right: 3px solid #fff;display: block; margin-bottom: 2px;padding-right: 10px;text-align: right;";
    //   }
    // });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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


  checkout() {
    this.router.navigateByUrl("ck/checkout")
  }
}
