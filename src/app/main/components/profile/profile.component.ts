import { Component } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { LocationService } from '../../../services/location.service';
import { UserService } from '../../../services/user.service';
import { firstValueFrom } from 'rxjs';

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

  regions: any = []
  provinces: any = []
  municipalities: any = []
  barangays: any = []

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
  
      region: [null, [Validators.required]],
      province: [null, [Validators.required]],
      municipality: [null, [Validators.required]],
      barangay: [null, [Validators.required]],
      street: [null, [Validators.required, Validators.maxLength(128)]],
  
      telephone_number: ['', [Validators.pattern('^[0-9 ()-]+$')]],
      mobile_number: [null, [Validators.required, Validators.pattern('^[0-9 ()-]+$')]],
      fax_number: ['', [Validators.pattern('^[0-9 ()-]+$')]],
      email: [null, [Validators.required, Validators.email]],
      website: ['', [Validators.maxLength(128)]],
    })
  }

  async ngOnInit() {
    await this.getCompanyProfile()

    this.regions = await this.ls.getRegions()
    let regionFormValue =  this.regions.find((data: any) => data.regDesc == this.formDetails.value.region)
    console.log(regionFormValue)
    
    this.provinces = await this.ls.getProvinces(regionFormValue.regCode)
    let provinceFormValue = this.provinces.find((data: any) => data.provDesc === this.formDetails.value.province)

    this.municipalities = await this.ls.getMunicipalities(provinceFormValue.provCode)
    let municipalityFormValue = this.municipalities.find((data: any) => data.citymunDesc === this.formDetails.value.municipality)
    
    console.log(this.municipalities)
    this.barangays = await this.ls.getBarangays(municipalityFormValue.citymunCode)
    let barangayFormValue = this.barangays.find((data: any) => data.brgyDesc === this.formDetails.value.barangay)

    this.formDetails.patchValue({
      region: regionFormValue,
      province: provinceFormValue,
      municipality: municipalityFormValue, 
      barangay: barangayFormValue
    })
  }

  uploadFile(event: any) {
    this.file = event.target.files[0];
  }

  async getCompanyProfile() {
    try {
      const profile = await firstValueFrom(this.ds.get('supervisor/profile'));
      this.formDetails.patchValue({ ...profile });
    } catch (error) {
      console.error(error);
    }
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
    
    let alert = this.gs.promptConfirmationAlert("Save?", "Your changes will be saved", 'question')
    
    alert.fire().then((result) => {
      if (result.isConfirmed) {
        this.create()
      }
    });
  }

  create() {
    var formData = new FormData();

    formData.append('company_name', this.formDetails.get('company_name')?.value);
    formData.append('description', this.formDetails.get('description')?.value);
    formData.append('region', this.formDetails.get('region')?.value.regDesc);
    formData.append('province', this.formDetails.get('province')?.value.provDesc);
    formData.append('municipality', this.formDetails.get('municipality')?.value.citymunDesc);
    formData.append('barangay', this.formDetails.get('barangay')?.value.brgyDesc);
    formData.append('street', this.formDetails.get('street')?.value);
    if(this.formDetails.get('telephone_number')?.value)
      formData.append('telephone_number', this.formDetails.get('telephone_number')?.value);
    formData.append('mobile_number', this.formDetails.get('mobile_number')?.value);
    if(this.formDetails.get('fax_number')?.value)
      formData.append('fax_number', this.formDetails.get('fax_number')?.value);
    formData.append('email', this.formDetails.get('email')?.value);
    if(this.formDetails.get('website')?.value)
      formData.append('website', this.formDetails.get('website')?.value);
    formData.append('email_2', this.formDetails.get('email_2')?.value);
    formData.append('password', this.formDetails.get('password')?.value);

    const companyHead = this.formDetails.get('company_head')?.value;
    formData.append('company_head[first_name]', companyHead.first_name);
    if(companyHead.middle_name)
      formData.append('company_head[middle_name]', companyHead.middle_name);
    formData.append('company_head[last_name]', companyHead.last_name);
    formData.append('company_head[sex]', companyHead.sex);
    if(companyHead.ext_name)
      formData.append('company_head[ext_name]', companyHead.ext_name);

    formData.append('head_position', this.formDetails.get('head_position')?.value);

    const supervisor = this.formDetails.get('immediate_supervisor')?.value;
    formData.append('immediate_supervisor[first_name]', supervisor.first_name);
    if(supervisor.middle_name)
      formData.append('immediate_supervisor[middle_name]', supervisor.middle_name);
    formData.append('immediate_supervisor[last_name]', supervisor.last_name);
    formData.append('immediate_supervisor[sex]', supervisor.sex);
    if(supervisor.ext_name)
      formData.append('immediate_supervisor[ext_name]', supervisor.ext_name);

    formData.append('supervisor_position', this.formDetails.get('supervisor_position')?.value);
    
    if(this.file)
      formData.append('image', this.file);

    this.ds.post('supervisor/profile', '', formData).subscribe(
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
          this.gs.errorAlert('Error!', "Invalid input.")
        }
        else if (error.status == 409) {
          this.gs.errorAlert(error.error.title, error.error.message)
        }
        else {
          this.gs.errorAlert('Oops!', "Something went wrong, please try again later.")
        }
      }
    )
  }

  async onRegionChange(region: any) {
    let regCode = region.regCode
    // console.log(region)
    this.provinces = []
    this.municipalities = []
    this.barangays = []

    this.formDetails.patchValue({
      municipality: null,
      province: null,
      barangay: null,
    })

    console.log(this.formDetails.value)
    this.provinces = await this.ls.getProvinces(regCode)
  }

  async onProvinceChange(province: any) {
    // console.log(province)
    
    this.municipalities = []
    this.barangays = []

    this.formDetails.patchValue({
      municipality: null,
      barangay: null,
    })

    this.municipalities = await this.ls.getMunicipalities(province.provCode)
  }

  async onMunicipalityChange(municipality: any) {
    // console.log(municipality)
    
    this.barangays = []

    this.formDetails.patchValue({
      barangay: null,
    })

    this.barangays = await this.ls.getBarangays(municipality.citymunCode)
  }
  
  
}
