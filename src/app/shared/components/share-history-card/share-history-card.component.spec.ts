import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareHistoryCardComponent } from './share-history-card.component';

describe('ShareHistoryCardComponent', () => {
  let component: ShareHistoryCardComponent;
  let fixture: ComponentFixture<ShareHistoryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareHistoryCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareHistoryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
