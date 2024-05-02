import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FOrderItemComponent } from './f-order-item.component';

describe('FOrderItemComponent', () => {
  let component: FOrderItemComponent;
  let fixture: ComponentFixture<FOrderItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FOrderItemComponent]
    });
    fixture = TestBed.createComponent(FOrderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
