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
  faBatteryEmpty,
  faCalendar,
  faFaceSmile,
  faPeopleArrows,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import {
  NgbAlertModule,
  NgbDateParserFormatter,
  NgbDatepickerConfig,
  NgbDatepickerModule,
  NgbDateStruct,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { Calendar, Collection, FoodOrder, LocalChef, Menu, PartyBundle } from 'src/app/model/all-foods';
import { Review } from 'src/app/model/common';
import { FoodOrderService } from 'src/app/services/foods/food-order.service';
import { ChefService } from 'src/app/services/foods/chef.service';
import { ReviewService } from 'src/app/services/common/review.service';
import { Utils } from 'src/app/services/common/utils';

@Component({
  selector: 'app-chef-home',
  templateUrl: './chef-home.component.html',
  styleUrls: ['./chef-home.component.css'],
})
export class ChefHomeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('widgetsContent', { read: ElementRef })
  public widgetsContent: ElementRef<any>;

  eventDate: NgbDateStruct;
  eventTime = { hour: 13, minute: 30 };

  faArrowLeft = faArrowLeft;
  faArrowRight = faArrowRight;
  faPeopleArrows = faPeopleArrows;
  faFaceSmile = faFaceSmile;
  faCalendar = faCalendar;
  faAngleDown = faAngleDown;
  faAngleUp = faAngleUp;

  chef: LocalChef | undefined;
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
  order: FoodOrder;
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: FoodOrderService,
    private chefService: ChefService,
    private reviewService: ReviewService,
    private _location: Location,
    private router: Router,
    private modalService: NgbModal,
    private config: NgbDatepickerConfig
  ) {
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
   
    this.orderService.orderSubject$.subscribe({
      next: (value) => {
        console.log('OrderSubject emitted a change' + JSON.stringify(value));
        if (Utils.isValid(value)) {
          this.order = value;
          this.cartTotal = this.order.total;
          if (this.order.partyOrder) {
            if ( this.order.partyDate){
              this.eventDate = {
                year: this.order.partyDate.getFullYear(),
                month: this.order.partyDate.getMonth() + 1,
                day: this.order.partyDate.getDate(),
              };
            }
          }
        }
      },
      error: (err) => console.error('OrderSubject emitted an error: ' + err),
      complete: () =>
        console.log('OrderSubject emitted the complete notification'),
    });

    this.activatedRoute.params.subscribe((params) => {
      this.supplierId = params['id'];
      console.log('Chef-home for supplier ' + this.supplierId);


      let chefObs = this.chefService.getChef(this.supplierId);
      chefObs.pipe(takeUntil(this.destroy$)).subscribe({
        next: (data) => {
          if (!Utils.isValid(data)) {
            this.incorrectLanding = true;
          } else {
            this.chef = data;
            this.fetchCollections();
            this.setPartyMinDate();
            this.fetchItems(this.chef._id);
            this.fetchCalendars(this.chef._id);
            this.fetchReviews(this.chef._id);
            if (this.chef.doPartyOrders) {
              this.fetchPartyBundles(this.chef._id);
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

  private fetchCollections() {
    let observable = this.chefService.getCollections(this.supplierId);
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
    if (this.chef && this.chef.partyOrderLeadDays > 0) {
      futureDate = this.addDays(current, this.chef.partyOrderLeadDays);
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
    this.chefService
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
    this.chefService
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
    this.chefService.getMenusForChef(supplierId).subscribe((items: Menu[]) => {
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
    if (this.chef !== null && this.chef !== undefined) {
      return Utils.getChefAddress(this.chef);
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

  isEventValid(): any {
    var today = new Date();
    const jsDate = new Date(
      this.eventDate.year,
      this.eventDate.month - 1,
      this.eventDate.day
    );
    var diff = this.calculateDiff(jsDate);
    // var eventDate = this.eventDate.day;
    console.log('Today ' + today + ' Event day ' + jsDate + ' Lapsed: ' + diff);
    return false;
  }

  calculateDiff(dateSent) {
    let currentDate = new Date();
    dateSent = new Date(dateSent);
    return Math.floor(
      (Date.UTC(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      ) -
        Date.UTC(
          dateSent.getFullYear(),
          dateSent.getMonth(),
          dateSent.getDate()
        )) /
      (1000 * 60 * 60 * 24)
    );
  }

  checkout() {
    this.router.navigateByUrl("f/checkout")
  }
}
