import { Component } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import Swal from 'sweetalert2';
import { LocationService } from '../../../services/location.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  industryPartner: any
  dataSource: any
  displayedColumns: any

  file: any = null

  formDetails: FormGroup
  passwordDetails: FormGroup
  showOldPassword: boolean = false
  showPassword: boolean = false

  //suffixes
  titles: string[] = ['Sr', 'Jr', 'II', 'III', 'IV', 'V'];

  //location 
  municipalities: any = []

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService,
    private ls: LocationService,
    private us: UserService
  ) {
    this.formDetails = this.fb.group({
      company_name: [null, [Validators.required, Validators.maxLength(64)]],
      description: [null, [Validators.required, Validators.maxLength(2048)]],
  
      // company_head: [null, [Validators.required, Validators.maxLength(128)]],
      company_head: this.fb.group({
        first_name: [null, [Validators.required, Validators.maxLength(64)]],
        middle_name: [null, [Validators.maxLength(64)]],
        last_name: [null, [Validators.required, Validators.maxLength(64)]],
        ext_name: [null], 
        sex: [null, Validators.required],
      }),

      head_position: [null, [Validators.required, Validators.maxLength(64)]],
      
      
      // immediate_supervisor: [null, [Validators.required, Validators.maxLength(128)]],
      immediate_supervisor: this.fb.group({
        first_name: [null, [Validators.required, Validators.maxLength(64)]],
        middle_name: [null, [Validators.maxLength(64)]],
        last_name: [null, [Validators.required, Validators.maxLength(64)]],
        ext_name: [null],
        sex: [null, Validators.required],
      }),
      supervisor_position: [null, [Validators.required, Validators.maxLength(64)]],
  
      region: ["III", [Validators.required, Validators.maxLength(32)]],
      province: [null, [Validators.required, Validators.maxLength(32)]],
      municipality: [null, [Validators.required, Validators.maxLength(32)]],
      barangay: [null, [Validators.maxLength(32)]],
      street: [null, [Validators.maxLength(32)]],
  
      telephone_number: [null, [Validators.pattern('^[0-9 ()-]+$')]],
      mobile_number: [null, [Validators.required, Validators.pattern('^[0-9 ()-]+$')]],
      fax_number: [null, [Validators.pattern('^[0-9 ()-]+$')]],
      email: [null, [Validators.required, Validators.email]],
      website: [null, [Validators.maxLength(128)]],
    })

    this.passwordDetails = this.fb.group({
      current_password: [null, [Validators.required]],
      new_password: [null, [Validators.required, Validators.minLength(8)]],
      password_confirmation: [null, [Validators.required, Validators.minLength(8)]]
    })
  }

  ngOnInit() {
    this.getCompanyProfile()

    // this.getLocation()
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  getCompanyProfile() {
    this.ds.get('supervisor/profile').subscribe(
      profile => {
        console.log(profile)
        this.formDetails.patchValue({...profile})
      },
      error => {
        console.error(error)
      }
    )
  }

  updateProfile() {
    if(this.formDetails.invalid) {
      const firstInvalidControl: HTMLElement = document.querySelector('form .ng-invalid')!;
      
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  
      this.formDetails.markAllAsTouched();
      return;
    }
    
    Swal.fire({
      title: "Save?",
      text: "Your changes will be saved",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.create()
      }
    });
  }

  create() {
    var payload = new FormData();
    
    // console.log(this.formDetails.value.company_head)
    // Object.entries(this.formDetails.value as { [key: string]: string | null})
    //       .forEach(([key, value]) =>{
    //         if(value)
    //           payload.append(key, value)
    //       })
    
    // payload.set('company_head[first_name]', this.formDetails.value.company_head.first_name)

    Object.entries(this.formDetails.value).forEach(([key, value]) => {
      // Check if the value is an object and not null
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        // Spread the properties of the object into the payload
        Object.entries(value).forEach(([subKey, subValue]) => {
          if (subValue) {
            payload.append(`${key}[${subKey}]`, subValue); // Append with key structure
          }
        });
      } else if (value) {
        // If it's a simple value (not an object), append it directly
        payload.append(key, String(value));
      }
      else {
        payload.append(key, '');
      }
    });
    if(this.file)
      payload.append('image', this.file);
    
    this.ds.post('supervisor/profile', '', payload).subscribe(
      response => {
        console.log(response)
        this.gs.successAlert(response.title, response.message)


        let user = this.us.getUser()
        if(response.image)
          user.industry_partner.image = response.image

        this.us.setUser(user)
      },
      error => {
        console.error(error)
        if (error.status == 422) {
          Swal.fire({
            title: "error!",
            text: "Invalid input.",
            icon: "error",
          });
        }
        else {
          Swal.fire({
            title: "error!",
            text: "Something went wrong, please try again later.",
            icon: "error",
          });
        }
      }
    )
  }

  // onRegionChange() {
  //   const selectedRegion = this.formDetails.get('region')?.value;

  //   console.log(selectedRegion)
  //   this.formDetails.get('province')?.setValue(null);
  // }

  getLocation() {
    // this.municipalities = this.ls.getMunicipality()
    // this.regions = this.ls.getRegions()
  }

  changePassword() {
    if(this.passwordDetails.invalid) {
      const firstInvalidControl: HTMLElement = document.querySelector('form .ng-invalid')!;
      
      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
  
      this.passwordDetails.markAllAsTouched();
      return;
    }

    const new_password = this.passwordDetails.get('new_password')?.value
    const confirm_password = this.passwordDetails.get('password_confirmation')?.value

    if(new_password != confirm_password) {
      this.gs.errorAlert("Password Doesn't Match!", "Please double check you inputs.")
      return
    }

    console.log(this.passwordDetails.value)
    this.ds.post('supervisor/profile/change-password', '', this.passwordDetails.value).subscribe(
      response => {
        this.gs.successAlert(response.title, response.message)
        this.passwordDetails.reset(this.passwordDetails.value)
      },
      error => {
        if(error.status === 422) {
          this.gs.errorAlert("Invalid Input!", "Please double check you inputs.")
        }
        else if(error.status === 403) {
          this.gs.errorAlert(error.error.title, error.error.message)
        }

        console.error(error)

      }
    )
  }
  
}
