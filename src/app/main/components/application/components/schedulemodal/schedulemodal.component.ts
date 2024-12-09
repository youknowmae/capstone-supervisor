import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GeneralService } from '../../../../../services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import * as moment from 'moment-timezone';

@Component({
  selector: 'app-schedulemodal',
  templateUrl: './schedulemodal.component.html',
  styleUrls: ['./schedulemodal.component.scss']
})
export class SchedulemodalComponent {
  scheduleForm: FormGroup;
  minDate: Date;

  constructor(
    private dialogRef: MatDialogRef<SchedulemodalComponent>,
    private gs: GeneralService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ds: DataService
  ) {
    const today = new Date();
    this.minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3);

    this.scheduleForm = this.fb.group({
      date: ['', Validators.required],
      time: ['', Validators.required],
      mode: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      message: [''] 
    });
  }

  submitForm() {
    if (this.scheduleForm.valid) {
      this.schedule(); // Call the schedule method
    } else {
      this.scheduleForm.markAllAsTouched(); // Mark fields as touched to show validation errors
    }
  }

  schedule() {
    Swal.fire({
      title: 'Proceed?',
      text: 'Are you sure you want to set this schedule?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#4f6f52',
      cancelButtonColor: '#777777',
    }).then((result) => {
      if (result.isConfirmed) {
        const form = new FormData 

        form.append('date', moment.tz(this.scheduleForm.value.date, 'Asia/Manila').format('YYYY-MM-DD'))
        form.append('time', this.scheduleForm.value.time);
        form.append('mode', this.scheduleForm.value.mode);
        form.append('location', this.scheduleForm.value.location);
        form.append('message', this.scheduleForm.value.message);

        this.ds.post('supervisor/applications/schedule/', this.data.id, form).subscribe(
          response => {
            this.gs.successAlert('Schedule Confirmed', 'The interview has been scheduled successfully.')
            this.dialogRef.close({ 
              action: 'scheduled',  
              data: response.data
            })
            console.log(response)
          },
          error => {
            console.log(error)
          }
        )
      }
    })
  }

  closeDialog(): void {
    this.dialogRef.close(); 
  }
}
