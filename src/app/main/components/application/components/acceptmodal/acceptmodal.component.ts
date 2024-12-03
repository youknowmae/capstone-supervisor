import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SchedulemodalComponent } from '../schedulemodal/schedulemodal.component';

@Component({
  selector: 'app-acceptmodal',
  templateUrl: './acceptmodal.component.html',
  styleUrls: ['./acceptmodal.component.scss']
})
export class AcceptmodalComponent {
  constructor(private dialog: MatDialog) {}

  selectOption(option: string) {
    if (option === 'interview') {
      this.dialog.open(SchedulemodalComponent, {
        width: '400px', 
        disableClose: true,
      });
    } else if (option === 'accepted') {
      console.log('Application Accepted');
    }
  }

  closeDialog(): void {
    this.dialog.closeAll(); 
  }
}
