import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodBasketComponent } from './food-basket.component';

describe('FoodBasketComponent', () => {
  let component: FoodBasketComponent;
  let fixture: ComponentFixture<FoodBasketComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FoodBasketComponent]
    });
    fixture = TestBed.createComponent(FoodBasketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
