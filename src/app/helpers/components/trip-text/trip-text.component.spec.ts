import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripTextComponent } from './trip-text.component';

describe('TripTextComponent', () => {
  let component: TripTextComponent;
  let fixture: ComponentFixture<TripTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TripTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TripTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
