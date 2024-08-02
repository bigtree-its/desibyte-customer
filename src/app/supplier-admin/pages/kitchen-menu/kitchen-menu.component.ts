import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { faCalendar, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, takeUntil } from 'rxjs';
import { CloudKitchen, Collection, Extra, Menu } from 'src/app/model/all-foods';
import { AccountService } from 'src/app/services/auth/account.service';
import { Utils } from 'src/app/services/common/utils';
import { CloudKitchenService } from 'src/app/services/foods/cloudkitchen.service';
import { MenuService } from 'src/app/services/foods/menu.service';
import { ProfileService } from 'src/app/services/supplier/profile.service';

@Component({
  selector: 'app-menu',
  templateUrl: './kitchen-menu.component.html',
  styleUrls: ['./kitchen-menu.component.css'],
})
export class KitchenMenuComponent implements OnInit,OnDestroy {

  destroy$ = new Subject<void>();
  activeLayout: string = '';
  subLayout: string = '';
  leafView: string = undefined;
  name: string = '';
  description: string;
  spiceLevel: number = 1;
  loginSessionJson: string;
  menus: Menu[];
  specials: Menu[];
  menu: Menu;
  displayEditMenuItem: boolean;

  collectionForm: FormGroup;

  menuOnEdit: Menu;
  itemName: string;
  itemDesc: string;
  itemPrice: number;
  itemDiscountedPrice: string;
  vegetarian: boolean;
  timeBound: boolean;
  doPartyOrders: boolean;
  doDelivery: boolean;
  selectedCollection: Collection;
  supplierEmail: string;
  menuEditPanelTitle: string;
  selectedCollectionForDisplay: Collection;
  cloudKitchen: CloudKitchen;
  collections: Collection[];
  collectionName: string;
  menuOnView: Menu;
  theMenu: Menu;
  menuNameErr: boolean;
  menuNameErrMsg: string;
  menuDescErr: boolean;
  menuDescErrMsg: string;
  menuPriceErr: boolean;
  menuPriceErrMsg: string;
  menuCollErr: boolean;
  menuCollErrMsg: string;

  readyBy: NgbDateStruct;
  orderBy: NgbDateStruct;
  minDate: any;
  faCalendar = faCalendar;

  extra: Extra = new Extra();
  choices: Extra[] = [];
  extras: Extra[] = [];

  form = new FormGroup({
    collection: new FormControl(null),
  });
  spiceLevelChanged: boolean;
  err: boolean;
  errMsg: string;
  special: boolean;
  choicePrice: any;
  extraType: string;

  faTrash = faTrash;
  errorMessage: null;
  errors: any;

  constructor(
    private _location: Location,
    private cloudKitchenService: CloudKitchenService,
    private profileSvc: ProfileService,
    private accountSvc: AccountService,
    private menuSvc: MenuService,
    private modalSvc: NgbModal,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activeLayout = 'Home';
    this.cloudKitchen = this.cloudKitchenService.getData();
    console.log('CloudKitchen: ' + JSON.stringify(this.cloudKitchen));
    if (this.cloudKitchen) {
      this.fetchCollections(this.cloudKitchen._id);
      this.fetchMenus(this.cloudKitchen._id);
    }
  }

  selectActiveLayout(main: string, sub: string) {
    this.activeLayout = main;
    this.subLayout = sub;
    if (main !== 'Home') {
      this.leafView = main;
    } else {
      this.leafView = undefined;
    }
  }

  selectSubLayout(sub: string) {
    this.subLayout = sub;
  }

  goBack() {
    this._location.back();
  }

  selectVegetarian(e: any) {
    if (e.target.checked) {
      this.menu.vegetarian = true;
    } else {
      this.menu.vegetarian = false;
    }
  }

  onChangeCollection(newValue: any) {
    this.selectedCollection = this.form.controls['collection'].value;
  }

  handleVegetarian(evt) {
    var target = evt.target;
    if (target.checked) {
      this.vegetarian = true;
    } else {
      this.vegetarian = false;
    }
  }

  handleTimebound(evt){
    var target = evt.target;
    if (target.checked) {
      this.timeBound = true;
    } else {
      this.timeBound = false;
    }
  }

  handleSpecial(evt) {
    var target = evt.target;
    if (target.checked) {
      this.special = true;
    } else {
      this.special = false;
    }
  }

  handlePartyOrders(evt) {
    var target = evt.target;
    if (target.checked) {
      this.doPartyOrders = true;
    } else {
      this.doPartyOrders = false;
    }
  }

  handleDelivery(evt) {
    var target = evt.target;
    if (target.checked) {
      this.doDelivery = true;
    } else {
      this.doDelivery = false;
    }
  }

  onRemoveFood(foodToDelete: Menu) {
    this.menuSvc.deleteFood(foodToDelete).subscribe(
      (any) => {
        this.fetchMenus(this.cloudKitchen._id);
      },
      (err) => {}
    );
  }

  fetchMenus(cloudKitchenId: string) {
    this.cloudKitchenService.getMenusForKitchen(cloudKitchenId).subscribe(
      (data: Menu[]) => {
        this.menus = data;
        this.specials = this.menus.filter((m) => {
          return m.special;
        });
      },
      (err) => {
        console.error('Error when fetching the menus');
      }
    );
  }

  fetchCollections(cloudKitchenId: string) {
    this.cloudKitchenService.getCollections(cloudKitchenId).subscribe(
      (data: Collection[]) => {
        this.collections = data;
      },
      (err) => {
        window.alert('Error when fetching the collections');
      }
    );
  }

  addCollection() {
    this.subLayout = 'addCollection';
  }

  viewMenu(menu: Menu) {
    this.menuOnView = menu;
    this.activeLayout = 'view';
    console.log('Viewing menu ' + JSON.stringify(this.menuOnView));
  }

  onEditMenu(menuToEdit: Menu) {
    this.subLayout = 'addMenu';
    this.theMenu = menuToEdit;
    var collection: Collection[] = this.collections.filter((e) => {
      return e._id === menuToEdit.collectionId;
    });
    this.form.controls['collection'].patchValue(collection[0]);
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  onRemoveMenu(menu: Menu) {}

  setActiveLayout(layout: string) {
    this.activeLayout = layout;
  }

  onClickAddNewMenu() {
    this.activeLayout = 'add';
  }
  selectCollectionForDisplay(col: Collection) {
    this.selectedCollectionForDisplay = col;
  }

  isCollectionSelected(col: Collection) {
    if (
      this.selectedCollectionForDisplay === null ||
      this.selectedCollectionForDisplay === undefined
    ) {
      this.selectedCollectionForDisplay = this.collections[0];
    }
    return this.selectedCollectionForDisplay._id === col._id;
  }

  saveMenu() {
    if (this.form.controls['collection'].value === null) {
      this.err = true;
      this.errMsg = 'Collection is required';
      return;
    }
    this.theMenu.collectionId = this.form.controls['collection'].value._id;
    if (this.theMenu.name === null || this.theMenu.name === undefined) {
      this.err = true;
      this.errMsg = 'Name is required.';
      return;
    } else {
      this.err = false;
    }
    if (!this.theMenu.description) {
      this.err = true;
      this.errMsg = 'Description is required.';
      return;
    } else {
      this.err = false;
    }
    if (this.theMenu.price === 0 || this.theMenu.price === undefined) {
      this.err = true;
      this.errMsg = 'Price is required.';
      return;
    } else {
      this.err = false;
    }
    this.theMenu.vegetarian = this.vegetarian;
    this.theMenu.special = this.special;
    this.theMenu.extras = this.extras;
    this.theMenu.choices = this.choices;
    if ( this.theMenu._id){
      let observable = this.menuSvc.updateMenu(this.theMenu);
      observable.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.errorMessage = null;
          this.theMenu = null;
          this.fetchMenus(this.cloudKitchen._id);
          this.activeLayout = 'Menus';
          this.selectSubLayout('listMenu');
        },
        error: (err) => {
          console.error('Error when updating menu.' + JSON.stringify(err));
          this.errors = err;
          this.errorMessage = err.error.detail;
        },
      });
    }else{
      this.menuSvc.createNewFood(this.theMenu)
      let observable = this.menuSvc.createNewFood(this.theMenu);
      observable.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.errorMessage = null;
          this.theMenu = null;
          this.fetchMenus(this.cloudKitchen._id);
          this.activeLayout = 'Menus';
          this.selectSubLayout('listMenu');
        },
        error: (err) => {
          console.error('Error when creating menu.' + JSON.stringify(err));
          this.errors = err;
          this.errorMessage = err.error.detail;
        },
      });

    }
    
  }

  openModal(content) {
    this.modalSvc
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {
          // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  handleSpiceLevelChange(e) {
    this.theMenu.spice = e.target.value;
  }

  saveNewCollection() {
    var collection: Collection = {};
    collection.cloudKitchenId = this.cloudKitchen._id;
    collection.name = this.collectionName;
    collection.timeBound = this.timeBound;
    if ( this.timeBound){
      if ( !this.readyBy || !this.orderBy){
        // notifia
      }
      collection.readyBy = Utils.getJsDate(this.readyBy);
      collection.orderBy = Utils.getJsDate(this.orderBy);
    }
    this.menuSvc
      .saveCollection(this.collectionName, this.cloudKitchen._id)
      .subscribe(
        (res) => {
          var col: Collection = res;
          this.collections.push(col);
          this.subLayout = 'listCollection';
          this.closeModal();
          this.collectionName = null;
        },
        (err) => {}
      );
  }

  cancel() {
    this.activeLayout = 'list';
  }

  addMenu() {
    this.subLayout = 'addMenu';
    this.theMenu = new Menu();
    this.theMenu.cloudKitchenId = this.cloudKitchen._id;
  }

  cancelError() {
    this.err = false;
    this.errMsg = '';
  }

  removeCollection(collection: Collection) {
    this.menuSvc.deleteCollection(collection).subscribe(
      (res) => {
        this.fetchCollections(this.cloudKitchen._id);
      },
      (err) => {
        this.err = true;
        this.errMsg = 'Unable to delete the collection. Retry later';
      }
    );
  }

  addExtra() {
    console.log('Extra ' + JSON.stringify(this.extra));
    if (
      this.extra === null ||
      this.extra === undefined ||
      this.extra.price === 0 ||
      this.extra.price === undefined ||
      this.extra.name === null ||
      this.extra.name === undefined ||
      this.extra.name.trim().length === 0
    ) {
      this.err = true;
      this.errMsg = 'Choice is not valid';
      return;
    }
    this.choices.forEach((e) => {
      if (e.name.trim() === this.extra.name.trim()) {
        this.err = true;
        this.errMsg = 'Choice is already exist';
        return;
      }
    });
    if (this.extraType === 'Choice') {
      this.theMenu.choices.push(this.extra);
    } else {
      this.theMenu.extras.push(this.extra);
    }
    this.err = false;
    this.errMsg = '';
    this.extra = new Extra();
    this.closeModal();
  }

  openExtraModal(content, dataType) {
    this.extraType = dataType;
    this.modalSvc
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {},
        (reason) => {}
      );
  }
  removeChoice(choice: Extra) {
    for (var i = 0; i < this.theMenu.choices.length; i++) {
      if (this.theMenu.choices[i].name == choice.name) {
        this.theMenu.choices.splice(i, 1);
      }
    }
  }
  removeExtra(e: Extra) {
    for (var i = 0; i < this.theMenu.extras.length; i++) {
      if (this.theMenu.extras[i].name == e.name) {
        this.theMenu.extras.splice(i, 1);
      }
    }
  }
  closeModal() {
    this.modalSvc.dismissAll();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
