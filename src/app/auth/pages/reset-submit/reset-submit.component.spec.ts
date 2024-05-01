import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSubmitComponent } from './reset-submit.component';

describe('ResetSubmitComponent', () => {
  let component: ResetSubmitComponent;
  let fixture: ComponentFixture<ResetSubmitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetSubmitComponent]
    });
    fixture = TestBed.createComponent(ResetSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
