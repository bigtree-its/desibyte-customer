import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountActivateComponent } from './account-activate.component';

describe('AccountActivateComponent', () => {
  let component: AccountActivateComponent;
  let fixture: ComponentFixture<AccountActivateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountActivateComponent]
    });
    fixture = TestBed.createComponent(AccountActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
