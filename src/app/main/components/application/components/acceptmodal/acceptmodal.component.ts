import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OJTInfoComponent } from '../ojtinfo/ojtinfo.component';

@Component({
  selector: 'app-acceptmodal',
  templateUrl: './acceptmodal.component.html',
  styleUrls: ['./acceptmodal.component.scss'],
})
export class AcceptmodalComponent {
  constructor(
    private dialogRef: MatDialogRef<AcceptmodalComponent>,
    private dialog: MatDialog
  ) {}

  selectOption(option: string) {
    if (option === 'interview') {
      this.dialogRef.close('interview');
    } else if (option === 'accepted') {
      this.openOJTInfoModal();
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  openOJTInfoModal(): void {
    const dialogRef = this.dialog.open(OJTInfoComponent, {
      width: '400px',
      disableClose: true, // Prevent closing without submitting or canceling
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('OJT Information:', result); // Log the submitted OJT info
        this.dialogRef.close('accepted');
      }
    });
  }
}
