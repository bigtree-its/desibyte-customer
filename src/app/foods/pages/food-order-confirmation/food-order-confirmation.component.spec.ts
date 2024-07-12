import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodOrderConfirmationComponent } from './food-order-confirmation.component';

describe('FoodOrderConfirmationComponent', () => {
  let component: FoodOrderConfirmationComponent;
  let fixture: ComponentFixture<FoodOrderConfirmationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodOrderConfirmationComponent]
    });
    fixture = TestBed.createComponent(FoodOrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
