import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareAddComponent } from './share-add.component';

describe('ShareAddComponent', () => {
  let component: ShareAddComponent;
  let fixture: ComponentFixture<ShareAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShareAddComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShareAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
