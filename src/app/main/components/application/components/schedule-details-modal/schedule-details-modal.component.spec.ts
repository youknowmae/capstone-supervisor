import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleDetailsModalComponent } from './schedule-details-modal.component';

describe('ScheduleDetailsModalComponent', () => {
  let component: ScheduleDetailsModalComponent;
  let fixture: ComponentFixture<ScheduleDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleDetailsModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
