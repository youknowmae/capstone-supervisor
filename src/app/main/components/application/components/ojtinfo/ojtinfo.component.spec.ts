import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OjtinfoComponent } from './ojtinfo.component';

describe('OjtinfoComponent', () => {
  let component: OjtinfoComponent;
  let fixture: ComponentFixture<OjtinfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OjtinfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OjtinfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
