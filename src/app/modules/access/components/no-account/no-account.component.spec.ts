import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoAccountComponent } from './no-account.component';

describe('NoAccountComponent', () => {
  let component: NoAccountComponent;
  let fixture: ComponentFixture<NoAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
