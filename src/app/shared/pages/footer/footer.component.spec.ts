import { ComponentFixture, TestBed } from '@angular/core/testing';

import { sticky-footerComponent } from './sticky-footer.component';

describe('sticky-footerComponent', () => {
  let component: sticky-footerComponent;
  let fixture: ComponentFixture<sticky-footerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [sticky-footerComponent]
    });
    fixture = TestBed.createComponent(sticky-footerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
