import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionDeletePopupComponent } from './collection-delete-popup.component';

describe('CollectionDeletePopupComponent', () => {
  let component: CollectionDeletePopupComponent;
  let fixture: ComponentFixture<CollectionDeletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionDeletePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollectionDeletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
