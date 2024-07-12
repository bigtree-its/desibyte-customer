import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostcodeLookupComponent } from './postcode-lookup.component';

describe('PostcodeLookupComponent', () => {
  let component: PostcodeLookupComponent;
  let fixture: ComponentFixture<PostcodeLookupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostcodeLookupComponent]
    });
    fixture = TestBed.createComponent(PostcodeLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
