import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulemodalComponent } from './schedulemodal.component';

describe('SchedulemodalComponent', () => {
  let component: SchedulemodalComponent;
  let fixture: ComponentFixture<SchedulemodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedulemodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulemodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
