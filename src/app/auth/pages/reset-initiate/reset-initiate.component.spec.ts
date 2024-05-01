import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetInitiateComponent } from './reset-initiate.component';

describe('ResetInitiateComponent', () => {
  let component: ResetInitiateComponent;
  let fixture: ComponentFixture<ResetInitiateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResetInitiateComponent]
    });
    fixture = TestBed.createComponent(ResetInitiateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
