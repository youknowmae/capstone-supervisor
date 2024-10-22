import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { DataService } from '../../../../../services/data.service';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-student-evaluation',
  templateUrl: './student-evaluation.component.html',
  styleUrl: './student-evaluation.component.scss'
})
export class StudentEvaluationComponent {
  id: any 
  totalRating: number = 0
  overallPerformance: any = {
    average: '', 
    remarks: ''
  } 

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

  file: any = null
  isImage: boolean = false
  fileSrc: any = null;
  formDetails: FormGroup 

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService,
    private us: UserService,
    private router: Router,
    private sanitizer: DomSanitizer
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
      }),
      total_rating: [null, Validators.required],
      remarks: [null, Validators.required],
      average: [null, Validators.required],

    })
  }

  get ifNotArray() {
    return this.formDetails.get('further_employment.if_not') as FormArray;
  }


  ngOnInit() {


    this.id = this.us.getStudentEvaluation()

    if(!this.id) {
      this.router.navigate(['main/student/list'])
    }

    this.formDetails.get('knowledge')?.valueChanges.subscribe(values => {
      this.calculateTotal(); 
    });
    
    this.formDetails.get('skills')?.valueChanges.subscribe(values => {
      this.calculateTotal();
    });
    
    this.formDetails.get('attitude')?.valueChanges.subscribe(values => {
      this.calculateTotal();
    });

    this.formDetails.get('further_employment.response')?.valueChanges.subscribe((value) => {
      const ifNotArray = this.formDetails.get('further_employment.if_not') as FormArray;

      if (value === '1') {
        ifNotArray.disable();  
        ifNotArray.reset()
      } else {
        ifNotArray.enable();  
      }
    });
  }

  getKnowledgeControls() {
    return (this.formDetails.get('knowledge') as FormArray).controls;
  }

  // Helper to get form array controls for skills
  getSkillsControls() {
    return (this.formDetails.get('skills') as FormArray).controls;
  }

  // Helper to get form array controls for attitude
  getAttitudeControls() {
    return (this.formDetails.get('attitude') as FormArray).controls;
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
    
    let file = this.file
    if (file) {
      const fileType = file.type;

      // Check if the file is an image
      if (fileType.startsWith('image/')) {
        this.isImage = true;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileSrc = e.target.result;
        };
        reader.readAsDataURL(file);
      } 
      // Check if the file is a PDF
      else if (fileType === 'application/pdf') {
        this.isImage = false;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fileSrc = e.target.result+ '#toolbar=0&navpanes=0&scrollbar=0';
        };
        reader.readAsDataURL(file);  // Read PDF as Data URL for embedding
      } else {
        this.fileSrc = null;  // Reset if not image or PDF
      }
    }
  }


  // Calculate the total rating
  calculateTotal() {
    const knowledgeTotal = this.getKnowledgeControls().reduce((sum, control) => sum + parseInt(control.value || 0), 0);
    const skillsTotal = this.getSkillsControls().reduce((sum, control) => sum + parseInt(control.value || 0), 0);
    const attitudeTotal = this.getAttitudeControls().reduce((sum, control) => sum + parseInt(control.value || 0), 0);
    
    this.totalRating = knowledgeTotal + skillsTotal + attitudeTotal;

    this.calculateAverage(this.totalRating)
  }
  
  calculateAverage(totalRating: number) {
    const isKnowledgeInvalid = this.formDetails?.get('knowledge')?.invalid;
    const isSkillsInvalid = this.formDetails?.get('skills')?.invalid;
    const isAttitudeInvalid = this.formDetails?.get('attitude')?.invalid;

    if (isKnowledgeInvalid || isSkillsInvalid || isAttitudeInvalid) {
      return
    }

    

    let totalRatingAverage = totalRating/130;

    let baseScore = 75 
    let variable = 25

    this.overallPerformance.average = Math.round((variable * totalRatingAverage) + baseScore)

    let score = this.overallPerformance.average
    if (score >= 96 && score <= 100) {
      this.overallPerformance.remarks = "Excellent";
    } else if (score >= 91 && score <= 95) {
      this.overallPerformance.remarks = "Very Good";
    } else if (score >= 86 && score <= 90) {
      this.overallPerformance.remarks = "Good";
    } else if (score >= 81 && score <= 85) {
      this.overallPerformance.remarks = "Fair";
    } else if (score >= 75 && score <= 80) {
      this.overallPerformance.remarks = "Poor";
    } 

    this.formDetails.patchValue({
      total_rating: this.totalRating,
      remarks: this.overallPerformance.remarks,
      average: this.overallPerformance.average,
    })
  }

  formCheck() {
    const firstInvalidControl: HTMLElement = document.querySelector('form .ng-invalid')!;
      
    if (firstInvalidControl) {
      firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    this.formDetails.markAllAsTouched();
  }

  submit() {
    if(this.isSubmitting) {
      return
    }

    if(!this.file) {
      this.gs.errorAlert('Certificate Required!', 'Please upload the student\'s completion certificate.')
      return
    }

    console.log(this.formDetails.value)

    var payload = new FormData();

    payload.append('evaluation', JSON.stringify(this.formDetails.value))
    if(this.file)
      payload.append('file', this.file)

    this.isSubmitting = true

    payload.forEach((value, key) => {
      console.log(key + ': ' + value);
    });
    
    this.ds.post('supervisor/students/evaluate/', this.id, payload).subscribe(
      response => {
        console.log('response');
        this.router.navigate(['main/student/list'])
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

  confirmation() {
    Swal.fire({
      title: "Submit?",
      text: "Are you sure you want to submit this evaluation?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.submit()
      }
    });
  }
}
