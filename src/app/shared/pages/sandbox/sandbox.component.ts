import { ViewportScroller } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, HostListener, inject, ViewChild } from '@angular/core';
import { faStar as starReg} from '@fortawesome/free-regular-svg-icons';
import { faStar as starSolid} from '@fortawesome/free-solid-svg-icons';
import { DragScrollComponent } from 'ngx-drag-scroll';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent {

  http = inject(HttpClient);

  faStarR = starReg;
  faStarS = starSolid;

  files: File[] = [];
  myMap: Map<string, string> = new Map<string, string>();
  productList: Product[] = new Array<Product>();
  isNavCollapse = false;

  @ViewChild('nav', { read: DragScrollComponent }) ds: DragScrollComponent;

  @HostListener('window:scroll', []) onScroll() {
    if (this.scroll.getScrollPosition()[1] > 70) {
      this.isNavCollapse = true;
    } else {
      this.isNavCollapse = false;
    }
  }

  constructor(private scroll: ViewportScroller) { }

  moveLeft() {
    this.ds.moveLeft();
  }

  moveRight() {
    this.ds.moveRight();
  }

  moveTo(index) {
    this.ds.moveTo(index);
  }

  ngAfterViewInit() {
    // Starting ngx-drag-scroll from specified index(3)
    setTimeout(() => {
      this.ds.moveTo(3);
    }, 0);
  }
  
  ngOnInit() {
    this.loadProducts().subscribe(e=>{
      for (let i = 0; i < 9; i++) {
        let product = new Product(e[i]);
        this.productList.push(product);
      }
    });
  }

  loadProducts() : Observable<Product[]>{
    return this.http.get<Product[]>("./assets/data/products.json" ) as Observable<Product[]>;
  }

  onWheel(event: WheelEvent): void {
    if (event.deltaY > 0) this.scrollToRight();
    else this.scrollToLeft();
  }

  scrollToLeft(): void {
    document.getElementById('scroll-1').scrollLeft -= 400;
  }

  scrollToRight(): void {
    document.getElementById('scroll-1')!.scrollLeft += 400;
  }

  // On file Select
  onChange(event: any) {
    const files = event.target.files;
    if (files.length) {

      [...files].forEach((file) => {
        this.files.push(file);
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.myMap.set(file.name, e.target.result);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  upload(){
    var formData = new FormData();
  var params = new HttpParams();
    [...this.files].forEach((file) => {
      console.log('Uploading image '+ file.name)
      formData.append("name", file.name);
      formData.append("image", file, file.name);
      params = params.set('filename', file.name);
    });
    // const upload$ = this.adService.uploadImages(ad, formData);
  

    const upload$ = this.http.post('http://localhost:8083/ads/v1/imagekit/upload', formData, {params});
    upload$.subscribe({
      next: () => {
        console.log('Success')
      },
      error: (error: any) => {
       console.log('Error')
      },
    });
  }
}


class Product {
  title: string;
  type: string;
  description: string;
  price: number;
  rating: number;
  image: string;

  constructor(product: any = {}) {
    this.title = product.title;
    this.type = product.type;
    this.description = product.description;
    this.price = product.price;
    this.rating = product.rating;
    this.image = 'https://alcodesbase.blob.core.windows.net/generic/sections-default-image.png';
  }
}