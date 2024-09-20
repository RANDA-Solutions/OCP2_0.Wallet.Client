import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHistoryComponent } from './share-history.component';

describe('ShareHistoryComponent', () => {
  let component: ShareHistoryComponent;
  let fixture: ComponentFixture<ShareHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareHistoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
