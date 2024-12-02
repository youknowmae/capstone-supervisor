import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-acceptmodal',
  templateUrl: './acceptmodal.component.html',
  styleUrl: './acceptmodal.component.scss'
})
export class AcceptmodalComponent {
  constructor(private dialogRef: MatDialogRef<AcceptmodalComponent>) {}

  selectOption(option: string) {
    this.dialogRef.close(option); // Pass the selected option back to the parent component
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
