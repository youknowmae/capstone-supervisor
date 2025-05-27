import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

@Component({
  selector: 'app-skillsmodal',
  templateUrl: './skillsmodal.component.html',
  styleUrl: './skillsmodal.component.scss',
})
export class SkillsmodalComponent {
  selectedSkills: Set<string> = new Set();
  maxSelect = 5;

skills: string[] = [
  'Adobe After Effects',
  'Adobe Animate',
  'Adobe Audition',
  'Adobe Dreamweaver',
  'Adobe Illustrator',
  'Adobe InDesign',
  'Adobe Lightroom',
  'Adobe Photoshop',
  'Adobe Premiere Pro',
  'Adobe XD',
  'Amazon Web',
  'Android',
  'Android SD Kit',
  'Angular',
  'AngularJS',
  'Assembly Language',
  'AWS',
  'AWK',
  'Backbone.js',
  'Blender',
  'Bootstrap',
  'Canva',
  'Certified Ethical Hacker (CEH)',
  'Cloud Security',
  'Clojure',
  'CSS',
  'Data and File Encryption',
  'Github',
  'GIMP',
  'Go',
  'Google Apps Scripts',
  'Google Cloud',
  'Growth Hacking',
  'Grunt',
  'Gulp',
  'Hadoop',
  'Haskell',
  'HTML',
  'HTML5',
  'iOS',
  'iOS SD Kit',
  'Inkscape',
  'Intrusion Detection',
  'Java',
  'JavaScript',
  'Kamatera',
  'Kotlin',
  'Krita',
  'Linux',
  'MacOS',
  'Malware Analysis',
  'Matplotlib',
  'MATLAB',
  'Microsoft Access',
  'Microsoft Azure',
  'Microsoft Excel',
  'Microsoft OneNote',
  'Microsoft Outlook',
  'Microsoft PowerPoint',
  'Microsoft Publisher',
  'Microsoft Word',
  'Microsoft Office 365',
  'Objective-C',
  'Oracle',
  'Perl',
  'PHP',
  'PL/SQL',
  'Power BI',
  'Programming in C',
  'Programming in C#',
  'Programming in C++',
  'Programming in Go',
  'Programming in HTML5',
  'Programming in Java',
  'Programming in JavaScript',
  'Programming in Kotlin',
  'Programming in MATLAB',
  'Programming in Objective-C',
  'Programming in Perl',
  'Programming in PL/SQL',
  'Programming in Python',
  'Programming in R',
  'Programming in Ruby',
  'Programming in Scala',
  'Programming in SQL',
  'Programming in Swift',
  'Programming in VB.Net',
  'Programming in Visual Basic',
  'React.js',
  'Scala',
  'SketchUp',
  'SQL',
  'Swift',
  'Tableau',
  'TensorFlow',
  'Ubuntu',
  'Unix',
  'Unity',
  'UX/UI',
  'VB.Net',
  'Visual Basic',
  'Windows OS',
  'Xcode'
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
