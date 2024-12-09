import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-schedule-details-modal',
  templateUrl: './schedule-details-modal.component.html',
  styleUrl: './schedule-details-modal.component.scss'
})
export class ScheduleDetailsModalComponent {

  constructor(
    private dialogRef: MatDialogRef<ScheduleDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    console.log(data)
  }

  formatTime(time: string): string {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  closeDialog(): void {
    this.dialogRef.close(); 
  }
}
