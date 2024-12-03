import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schedulemodal',
  templateUrl: './schedulemodal.component.html',
  styleUrls: ['./schedulemodal.component.scss']
})
export class SchedulemodalComponent {
  constructor(private dialogRef: MatDialogRef<SchedulemodalComponent>) {}

  schedule() {
    Swal.fire({
      title: 'Schedule Confirmed',
      text: 'The interview has been scheduled successfully.',
      icon: 'success',
      confirmButtonColor: '#4caf50',
      confirmButtonText: 'OK',
    }).then(() => {
      console.log('Interview Scheduled'); 
      this.dialogRef.close(); 
    });
  }

  closeDialog(): void {
    this.dialogRef.close(); 
  }
}
