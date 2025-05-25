import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillsmodalComponent } from './skillsmodal.component';

describe('SkillsmodalComponent', () => {
  let component: SkillsmodalComponent;
  let fixture: ComponentFixture<SkillsmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SkillsmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillsmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
