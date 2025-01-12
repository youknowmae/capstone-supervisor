import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import moment from 'moment';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';

@Component({
  selector: 'app-ojtinfo',
  templateUrl: './ojtinfo.component.html',
  styleUrls: ['./ojtinfo.component.scss'],
})
export class OJTInfoComponent {
  ojtInfo: FormGroup
  today: Date

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OJTInfoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService,
    private gs: GeneralService
  ) {
    this.today = new Date()

    this.ojtInfo = this.fb.group({
      start_date: [null, [Validators.required]],
      department: [null, [Validators.required, Validators.maxLength(64)]],
      task: [null, [Validators.required, Validators.maxLength(516)]],
    })
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }

  submit(): void {
    if(this.ojtInfo.invalid) {
      const firstInvalidControl: HTMLElement = document.querySelector('form .ng-invalid')!;
      
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  
      this.ojtInfo.markAllAsTouched();
      return;
    }

    var payload = new FormData();

    payload.append('department', this.ojtInfo.value.department)
    payload.append('task', this.ojtInfo.value.task)
    payload.append('start_date', moment.tz(this.ojtInfo.value.start_date, 'Asia/Manila').format('YYYY-MM-DD'))

    console.log('OJT Information:', this.ojtInfo.value);
    
    this.ds.post('supervisor/applications/accept/', this.data.id, payload).subscribe(
      (response) => {
        this.gs.successAlert(response.title, response.message);
        this.dialogRef.close(response.data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
