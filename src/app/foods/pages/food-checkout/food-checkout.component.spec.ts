import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodCheckoutComponent } from './food-checkout.component';

describe('FoodCheckoutComponent', () => {
  let component: FoodCheckoutComponent;
  let fixture: ComponentFixture<FoodCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodCheckoutComponent]
    });
    fixture = TestBed.createComponent(FoodCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
