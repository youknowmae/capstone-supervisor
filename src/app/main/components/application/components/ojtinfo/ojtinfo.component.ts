import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-ojtinfo',
  templateUrl: './ojtinfo.component.html',
  styleUrls: ['./ojtinfo.component.scss'],
})
export class OJTInfoComponent {
  ojtInfo = {
    startDate: '',
    department: '',
    task: '',
  };

  constructor(private dialogRef: MatDialogRef<OJTInfoComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  submit(): void {
    console.log('OJT Information:', this.ojtInfo);
    this.dialogRef.close(this.ojtInfo);
  }
}
