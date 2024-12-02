import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptmodalComponent } from './acceptmodal.component';

describe('AcceptmodalComponent', () => {
  let component: AcceptmodalComponent;
  let fixture: ComponentFixture<AcceptmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
