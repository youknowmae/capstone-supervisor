import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SchedulemodalComponent } from '../schedulemodal/schedulemodal.component';

@Component({
  selector: 'app-acceptmodal',
  templateUrl: './acceptmodal.component.html',
  styleUrls: ['./acceptmodal.component.scss']
})
export class AcceptmodalComponent {
  constructor(
    private dialogRef: MatDialogRef<AcceptmodalComponent>,
    private dialog: MatDialog
  ) {}

  selectOption(option: string) {
    if (option === 'interview') {
      this.dialog.open(SchedulemodalComponent, {
        width: '400px',
      });
    } else if (option === 'accepted') {
      console.log('Application Accepted');
    }
    this.dialogRef.close(option);
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
