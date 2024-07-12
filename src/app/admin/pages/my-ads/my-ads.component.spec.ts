import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAdsComponent } from './my-ads.component';

describe('MyAdsComponent', () => {
  let component: MyAdsComponent;
  let fixture: ComponentFixture<MyAdsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyAdsComponent]
    });
    fixture = TestBed.createComponent(MyAdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
