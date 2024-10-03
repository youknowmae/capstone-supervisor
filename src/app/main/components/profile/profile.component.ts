import { Component } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import Swal from 'sweetalert2';
import { LocationService } from '../../../services/location.service';

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

  //suffixes
  titles: string[] = ['Sr', 'Jr', 'II', 'III', 'IV', 'V'];

  //location 
  municipalities: any = []

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService,
    private ls: LocationService
  ) {
    this.formDetails = this.fb.group({
      company_name: [null, [Validators.required, Validators.maxLength(64)]],
      description: [null, [Validators.required, Validators.maxLength(2048)]],
  
      // company_head: [null, [Validators.required, Validators.maxLength(128)]],
      company_head: this.fb.group({
        first_name: [null, [Validators.required, Validators.maxLength(64)]],
        middle_name: [null, [Validators.maxLength(64)]],
        last_name: [null, [Validators.required, Validators.maxLength(64)]],
        ext_name: [null], // Optional, no validators
      }),

      head_position: [null, [Validators.required, Validators.maxLength(64)]],
      
      
      // immediate_supervisor: [null, [Validators.required, Validators.maxLength(128)]],
      immediate_supervisor: this.fb.group({
        first_name: [null, [Validators.required, Validators.maxLength(64)]],
        middle_name: [null, [Validators.maxLength(64)]],
        last_name: [null, [Validators.required, Validators.maxLength(64)]],
        ext_name: [null], // Optional, no validators
      }),
      supervisor_position: [null, [Validators.required, Validators.maxLength(64)]],
  
      region: ["III", [Validators.required, Validators.maxLength(32)]],
      province: [null, [Validators.required, Validators.maxLength(32)]],
      municipality: [null, [Validators.required, Validators.maxLength(32)]],
      barangay: [null, [Validators.required, Validators.maxLength(32)]],
      street: [null, [Validators.required, Validators.maxLength(32)]],
      zip_code: [null, [Validators.required, Validators.pattern('[0-9]{4}')]],
  
      telephone_number: [null, [Validators.pattern('(09)[0-9]{9}')]],
      mobile_number: [null, [Validators.required, Validators.pattern('(09)[0-9]{9}')]],
      fax_number: [null, [Validators.pattern('(09)[0-9]{9}')]],
      email: [null, [Validators.required, Validators.email]],
      website: [null, [Validators.maxLength(128)]],
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
        console.log(profile )
        console.log(profile.company_head)
        this.formDetails.patchValue({...profile})
      },
      error => {
        console.error(error)
      }
    )
  }

  submit() {
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
        this.gs.successAlert(response.title, response.message)
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
    this.municipalities = this.ls.getMunicipality()
    // this.regions = this.ls.getRegions()
  }
  
}
