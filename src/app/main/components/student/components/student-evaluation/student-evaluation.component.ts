import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';

@Component({
  selector: 'app-student-evaluation',
  templateUrl: './student-evaluation.component.html',
  styleUrl: './student-evaluation.component.scss'
})
export class StudentEvaluationComponent {
  isSubmitting: boolean = false
  exitPollDetails: any = {
    user: '',
    industry_partner: {
      supervisor_position: '',
      immediate_supervisor: '',
      full_address: '',
      company_name: ''
    },
    total_hours_completed: ''
  }

  formDetails: FormGroup 

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService,
    private us: UserService
  ) {
    this.formDetails = this.fb.group({
      knowledge: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
      ]),
      skills: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
      ]),
      attitude: this.fb.array([
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required),
        this.fb.control(null, Validators.required), 
        this.fb.control(null, Validators.required),
      ]),
      suggestions: this.fb.group({
        strong_point: [null, [Validators.required, Validators.maxLength(256)]],
        utilized_effectively: [null, [Validators.required, Validators.maxLength(256)]],
        weak_point: [null, [Validators.required, Validators.maxLength(256)]],
        corrected_by: [null, [Validators.required, Validators.maxLength(256)]],
        other_comment: [null, [Validators.required, Validators.maxLength(256)]],
      }),
      further_employment: this.fb.group({
        response: [null, Validators.required],
        why: [null, [Validators.required, Validators.maxLength(256)]],
        if_not: this.fb.array([
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null),
          this.fb.control(null), 
          this.fb.control(null),
        ])
      })
    })
  }

  ngOnInit() {
    // this.exitPollDetails.user = this.us.getUser()

    // this.getExitpollSupportingDetails()

    // console.log(this.exitPollDetails)
  }

  getExitpollSupportingDetails() {
    // return
    this.ds.get('student/exit-poll/details').subscribe(
      response => {
        response.industry_partner.full_address = response.industry_partner.street + ' ' + response.industry_partner.barangay + ' ' + response.industry_partner.municipality + ', ' + response.industry_partner.province

        this.exitPollDetails.industry_partner = response.industry_partner
        this.exitPollDetails.total_hours_completed = response.total_hours_completed

        this.formDetails.patchValue({
          industry_partner: response.industry_partner.id
        })
      },
      error => {
        console.error(error)
      }
    )
  }

  submit() {
    if(this.isSubmitting) {
      return
    }

    console.log(this.formDetails.value)
    if(this.formDetails.invalid) {
      const firstInvalidControl: HTMLElement = document.querySelector('form .ng-invalid')!;
      
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  
      this.formDetails.markAllAsTouched(); // Mark all fields as touched to show validation errors
      return;
    }

    this.isSubmitting = true

    this.ds.post('supervisor/students/evaluate/', 4, this.formDetails.value).subscribe(
      response => {
        console.log('response');
        this.gs.successAlert('Submitted!', response.message)
        this.isSubmitting = false
      },
      error => {
        console.error(error)
        if(error.status === 409) {
          this.gs.errorAlert(error.error.title, error.error.message)
        }
        else {
          this.gs.errorAlert('Error!', 'Something went wrong, Please try again later.')
        }
        this.isSubmitting = false
      }
    )
  }
}
