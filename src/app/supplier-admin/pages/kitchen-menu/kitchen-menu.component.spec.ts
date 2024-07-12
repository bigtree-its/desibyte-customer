import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenMenuComponent } from './kitchen-menu.component';

describe('MenuComponent', () => {
  let component: KitchenMenuComponent;
  let fixture: ComponentFixture<KitchenMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [KitchenMenuComponent]
    });
    fixture = TestBed.createComponent(KitchenMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
