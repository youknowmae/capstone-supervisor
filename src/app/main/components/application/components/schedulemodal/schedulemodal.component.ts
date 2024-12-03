import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-schedulemodal',
  templateUrl: './schedulemodal.component.html',
  styleUrl: './schedulemodal.component.scss'
})
export class SchedulemodalComponent {
  constructor(private dialogRef: MatDialogRef<SchedulemodalComponent>) {}

  schedule() {
    // Handle scheduling logic here
    console.log('Interview Scheduled');
    this.dialogRef.close();
  }
}
