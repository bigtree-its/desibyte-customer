import { Location } from '@angular/common';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { faArrowLeft, faBath, faBed, faHouse, faLocationDot, faMinus, faPlus } from '@fortawesome/free-solid-svg-icons';
import { first } from 'rxjs/operators';
import { AdSearchQuery, GeneralAd, ImageKitImg } from 'src/app/model/all-ads';
import { LoginResponse, User } from 'src/app/model/all-auth';
import { AdsService } from 'src/app/services/ads/ads.service';
import { AccountService } from 'src/app/services/auth/account.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-ad-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})
export class AdDetailComponent implements OnInit {

  /** Questions */
  questionForm: FormGroup;
  questionSubmissionLoding = false;
  submittedQuestion = false;
  openReviewForm: boolean = false;
  
  customerSession: LoginResponse;
  customer: User;
  ad: GeneralAd;
  category: string;
  display_picture: string;
  gallery: ImageKitImg[] = [];
  @ViewChild('widgetsContent') widgetsContent: ElementRef;
  // @ViewChild('googleMap') googleMap: google.maps.Map;

  // zoom: number = 12;
  // center: google.maps.LatLngLiteral;
  // options: google.maps.MapOptions = {
  //   mapTypeId: google.maps.MapTypeId.ROADMAP,
  //   zoomControl: true,
  //   scrollwheel: true,
  //   disableDoubleClickZoom: true,
  //   maxZoom: 19,
  //   minZoom: 8,
  // }
  // markers: any = []

  error: boolean = false;
  errorMessage: string;
  faPlus = faPlus;
  faMinus = faMinus;
  faArrowLeft = faArrowLeft;
  faHouse= faHouse;
  faBed= faBed;
  faBath= faBath;
  faLocation = faLocationDot;

  user: User;
  adReference: any;
  returnUrl: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private adService: AdsService,
    private accountService: AccountService,
    private formBuilder: FormBuilder,
    private _location: Location
  ) { }

  goBack() {
    this._location.back();
  }

  ngOnInit(): void {
    this.accountService.getData();
    this.accountService.loginSession$.subscribe({
      next: (value) => {
        this.user = value;
      },
      error: (err) => console.error('User$ emitted an error: ' + err),
      complete: () => console.log('User$ emitted the complete notification'),
    });
    this.activatedRoute.params.subscribe(params => {
      this.adReference = params['id'];
      this.returnUrl = '/ads/g/'+ this.adReference;
      console.log(`Ad Reference: ${this.adReference}`);
      var query: AdSearchQuery ={};
      query.reference = this.adReference;
      this.adService.getAds(query).subscribe(result => {
        if ( result && result.length > 0){
          this.ad = result[0];
          console.log('The ad : ' + JSON.stringify(this.ad));
          // this.center = {
          //   lat: this.ad.address.latitude,
          //   lng: this.ad.address.longitude,
          // }
          // this.addMarker();
          if ( this.ad.image){
            this.display_picture = this.ad.image.url;
            this.gallery.push(this.ad.image);
          }else{
            this.display_picture = this.ad.gallery[0].url;
          }
          
         
          // this.ad.gallery.forEach(p => {
          //   this.gallery.push(p);
          // })
        }
      });
    })

    // this.customerSession = this.accountService.getUserSession();
    // if ( this.customerSession !== null && this.customerSession !== undefined){
    //   this.customer = this.customerSession.user;
    // }

    this.questionForm = this.formBuilder.group({
      question: ['']
    });

    // const mapProperties = {
    //   center: new google.maps.LatLng(35.2271, -80.8431),
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // };
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapProperties);

    // this.map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    //   center: { lat: -34.397, lng: 150.644 },
    //   zoom: 8,
    // });

    navigator.geolocation.getCurrentPosition((position) => {
      console.log('The current location lat ' + position.coords.latitude);
      console.log('The current location lon ' + position.coords.longitude);
      
    })

  }

    // convenience getter for easy access to form fields
    get getQuestionForm() { return this.questionForm.controls; }

  // zoomIn() {
  //   if (this.zoom < this.options.maxZoom) this.zoom++
  // }

  // zoomOut() {
  //   if (this.zoom > this.options.minZoom) this.zoom--
  // }

  displayPicture(img: string) {
    this.display_picture = img;
  }
  scrollLeft() {
    this.widgetsContent.nativeElement.scrollLeft -= 150;

  }

  scrollRight() {
    this.widgetsContent.nativeElement.scrollLeft += 150;
  }

  addMarker() {
    // var position: any = {
    //   lat: this.center.lat,
    //   lng: this.center.lng,
    // };

    // var marker = new google.maps.Marker({
    //   position: position,
    //   map: this.googleMap,
    //   title: 'markers'
    // });
    // this.markers.push(marker);

    // this.markers.push({
    //   position: {
    //     lat: this.center.lat + ((Math.random() - 0.5) * 2) / 10,
    //     lng: this.center.lng + ((Math.random() - 0.5) * 2) / 10,
    //   },
    //   label: {
    //     color: 'red',
    //     text: 'Marker label ' + (this.markers.length + 1),
    //   },
    //   title: 'Marker title ' + (this.markers.length + 1),
    //   options: { animation: google.maps.Animation.BOUNCE },
    // })
  }

 
}