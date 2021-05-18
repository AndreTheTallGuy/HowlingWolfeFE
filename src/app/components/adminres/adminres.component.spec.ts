import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminresComponent } from './adminres.component';

describe('AdminresComponent', () => {
  let component: AdminresComponent;
  let fixture: ComponentFixture<AdminresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
