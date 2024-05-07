import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeAPartnerComponent } from './become-a-partner.component';

describe('BecomeAPartnerComponent', () => {
  let component: BecomeAPartnerComponent;
  let fixture: ComponentFixture<BecomeAPartnerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BecomeAPartnerComponent]
    });
    fixture = TestBed.createComponent(BecomeAPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
