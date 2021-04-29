import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouemailComponent } from './thankyouemail.component';

describe('ThankyouemailComponent', () => {
  let component: ThankyouemailComponent;
  let fixture: ComponentFixture<ThankyouemailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThankyouemailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThankyouemailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
