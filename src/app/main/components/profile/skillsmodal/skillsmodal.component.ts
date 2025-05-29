import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { DataService } from '../../../../services/data.service';
import { GeneralService } from '../../../../services/general.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-skillsmodal',
  templateUrl: './skillsmodal.component.html',
  styleUrl: './skillsmodal.component.scss',
})
export class SkillsmodalComponent {
  selectedSkills: Set<string> = new Set();
  maxSelect = 15;

  skills: string[] = [];

  constructor(
    private ref: MatDialogRef<SkillsmodalComponent>,
    private gs: GeneralService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService,
    private us: UserService
  ) {
    // Initialize selectedSkills with the data
    if (data?.selected?.length) {
      this.selectedSkills = new Set(data.selected);
    }
  }

  ngOnInit() {
    this.getSkills();
  }

  getSkills() {
    const technicalSkills = this.us.getTechnicalSkillsData();

    if (technicalSkills) {
      this.skills = technicalSkills;
      return;
    }

    this.ds.get('technical-skills').subscribe((response) => {
      this.skills = response.map((item: any) => item.skills);
      this.us.setTechnicalSkillsData(this.skills);
      console.log(this.skills);
    });
  }

  toggleSkillSelection(skill: string): void {
    if (this.selectedSkills.has(skill)) {
      this.selectedSkills.delete(skill);
    } else {
      if (this.selectedSkills.size < this.maxSelect) {
        this.selectedSkills.add(skill);
      } else {
        // Optional: show warning/toast if trying to add more than 5
      }
    }
  }

  isSelected(skill: string): boolean {
    return this.selectedSkills.has(skill);
  }

  closePopup() {
    this.ref.close(null);
  }

  submit() {
    this.ref.close(Array.from(this.selectedSkills));
  }
}
