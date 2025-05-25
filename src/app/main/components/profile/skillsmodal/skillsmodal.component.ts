import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import moment from 'moment';
import { Inject } from '@angular/core';


@Component({
  selector: 'app-skillsmodal',
  templateUrl: './skillsmodal.component.html',
  styleUrl: './skillsmodal.component.scss'
})
export class SkillsmodalComponent {
  selectedSkills: Set<string> = new Set();
  maxSelect = 5;

  skills: string[] = [
    'Android Development',
    'AngularJS',
    'Ansible',
    'ASP.NET',
    'Assembly Language',
    'AWK',
    'Backbone.js',
    'Bootstrap',
    'Google Apps Scripts',
    'Growth Hacking',
    'Grunt',
    'Gulp',
    'Hadoop',
    'Haskell',
    'HTML',
    'HTML 5',
  ];

  constructor(
    private ref: MatDialogRef<SkillsmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Initialize selectedSkills with the data
    if (data?.selected?.length) {
      this.selectedSkills = new Set(data.selected);
    }
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
