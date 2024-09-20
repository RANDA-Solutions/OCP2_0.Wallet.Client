import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeExpiredComponent } from './code-expired.component';

describe('CodeExpiredComponent', () => {
  let component: CodeExpiredComponent;
  let fixture: ComponentFixture<CodeExpiredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeExpiredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CodeExpiredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
