import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavContentComponent } from './side-nav-content.component';

describe('SideNavContentComponent', () => {
  let component: SideNavContentComponent;
  let fixture: ComponentFixture<SideNavContentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SideNavContentComponent]
    });
    fixture = TestBed.createComponent(SideNavContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
