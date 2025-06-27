import { Component } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { LocationService } from '../../../services/location.service';
import { UserService } from '../../../services/user.service';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ChangeProfileComponent } from './change-profile/change-profile.component';
import { SkillsmodalComponent } from './skillsmodal/skillsmodal.component';
import { MOU } from '../../../models/mou.model';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  logo: any;

  formDetails: FormGroup;
  mou: MOU = {
    expiration_date: null,
    start_date: null,
    file_location: '',
  };

  displayedSkills: string[] = [];

  //suffixes
  titles: string[] = ['Sr', 'Jr', 'II', 'III', 'IV', 'V'];

  regions: any = [];
  provinces: any = [];
  municipalities: any = [];
  barangays: any = [];

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService,
    private ls: LocationService,
    private us: UserService,
    private matDialog: MatDialog,
    private sanitizer: DomSanitizer
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
      supervisor_position: [
        null,
        [Validators.required, Validators.maxLength(64)],
      ],

      region: [null, [Validators.required]],
      province: [null, [Validators.required]],
      municipality: [null, [Validators.required]],
      barangay: [null, [Validators.required]],
      street: [null, [Validators.required, Validators.maxLength(128)]],

      telephone_number: ['', [Validators.pattern('^[0-9 ()-]+$')]],
      mobile_number: [
        null,
        [Validators.required, Validators.pattern('^[0-9 ()-]+$')],
      ],
      fax_number: ['', [Validators.pattern('^[0-9 ()-]+$')]],
      email: [null, [Validators.required, Validators.email]],
      website: ['', [Validators.maxLength(128)]],

      // job_requirements: this.fb.array([
      //   this.fb.control(null, [Validators.required, Validators.maxLength(32)]),
      // ]),

      technical_skills: this.fb.array([
        this.fb.control(null, [Validators.required, Validators.maxLength(128)]),
      ]),
    });
  }

  async ngOnInit() {
    await this.getCompanyProfile();

    this.regions = await this.ls.getRegions();
    let regionFormValue = this.regions.find(
      (data: any) => data.regDesc == this.formDetails.value.region
    );

    this.provinces = await this.ls.getProvinces(regionFormValue.regCode);
    let provinceFormValue = this.provinces.find(
      (data: any) => data.provDesc === this.formDetails.value.province
    );

    this.municipalities = await this.ls.getMunicipalities(
      provinceFormValue.provCode
    );
    let municipalityFormValue = this.municipalities.find(
      (data: any) => data.citymunDesc === this.formDetails.value.municipality
    );

    this.barangays = await this.ls.getBarangays(
      municipalityFormValue.citymunCode
    );
    let barangayFormValue = this.barangays.find(
      (data: any) => data.brgyDesc === this.formDetails.value.barangay
    );

    this.formDetails.patchValue({
      region: regionFormValue,
      province: provinceFormValue,
      municipality: municipalityFormValue,
      barangay: barangayFormValue,
    });
  }

  get requirementsForm(): FormArray {
    return this.formDetails.get('job_requirements') as FormArray;
  }

  addSkillRequirement() {
    if (this.requirementsForm.length >= 7) {
      return;
    }

    const requirementsForm: FormControl = this.fb.control(null, [
      Validators.required,
      Validators.maxLength(32),
    ]);

    this.requirementsForm.push(requirementsForm);
  }

  removeSkills(Index: number) {
    this.requirementsForm.removeAt(Index);
  }

  openChangeProfileModal() {
    const dialog = this.matDialog.open(ChangeProfileComponent, {
      data: { logo: this.logo },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.logo = result;
      }
    });
  }

  get skillButtonLabel(): string {
    return this.displayedSkills.length < 5
      ? 'Add Technical Skills'
      : 'Edit Technical Skills';
  }

  get technicalSkillsFormArray(): FormArray {
    return this.formDetails.get('technical_skills') as FormArray;
  }

  openTechnicalSkills(): void {
    const dialogRef = this.matDialog.open(SkillsmodalComponent, {
      width: '600px',
      data: { selected: this.displayedSkills }, // pass existing skills here
    });

    dialogRef.afterClosed().subscribe((result: string[] | null) => {
      console.log(result);

      if (result && result.length > 0) {
        const removed = this.displayedSkills.filter(
          (skill) => !result.includes(skill)
        );
        const added = result.filter(
          (skill) => !this.displayedSkills.includes(skill)
        );

        if (
          removed.length === 1 &&
          added.length === 1 &&
          this.displayedSkills.length === 5
        ) {
          const indexToReplace = this.displayedSkills.indexOf(removed[0]);
          if (indexToReplace !== -1) {
            this.displayedSkills[indexToReplace] = added[0];
          }
        } else {
          this.displayedSkills = result;
        }

        this.technicalSkillsFormArray.clear();

        if (result.length < 5) {
          this.technicalSkillsFormArray.push(
            this.fb.control(null, [
              Validators.required,
              Validators.maxLength(128),
            ])
          );
          return;
        }

        result.forEach((skill) => {
          this.technicalSkillsFormArray.push(
            this.fb.control(skill, [
              Validators.required,
              Validators.maxLength(128),
            ])
          );
        });

        console.log(this.formDetails.value.technical_skills);
      } else if (result && result.length === 0) {
        this.technicalSkillsFormArray.clear();
        this.displayedSkills = [];
        this.technicalSkillsFormArray.push(
          this.fb.control(null, [
            Validators.required,
            Validators.maxLength(128),
          ])
        );
      }
    });
  }

  async getCompanyProfile() {
    try {
      const profile = await firstValueFrom(this.ds.get('supervisor/profile'));
      this.logo = profile.image;
      this.formDetails.patchValue({ ...profile });
      this.displayedSkills = profile.technical_skills || [];
      this.mou = {
        ...profile.latest_mou,
        file_location: this.sanitizer.bypassSecurityTrustResourceUrl(
          profile.latest_mou.file_location
        ),
      };

      const technicalSkills = profile.technical_skills;

      if (technicalSkills) {
        this.technicalSkillsFormArray.clear();

        technicalSkills.forEach((item: any) => {
          this.technicalSkillsFormArray.push(
            this.fb.control(item, [Validators.required])
          );
        });
      }

      if (profile.job_requirements?.length > 0) {
        this.requirementsForm.clear();

        profile.job_requirements.forEach((value: any) => {
          this.requirementsForm.push(
            this.fb.control(value, [
              Validators.required,
              Validators.maxLength(32),
            ])
          );
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  async updateProfile() {
    if (this.formDetails.invalid) {
      //custom validator
      if (this.formDetails.get('technical_skills')?.invalid) {
        this.gs.makeAlert(
          'error',
          'Technical Skills Required!',
          'Please place at least 5 technical skills'
        );
        return;
      }

      const firstInvalidControl: HTMLElement =
        document.querySelector('form .ng-invalid')!;

      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      this.formDetails.markAllAsTouched();
      return;
    }

    const res = await this.gs.confirmationAlert(
      'Save?',
      'Your changes will be saved',
      'question',
      'Save',
      'confirmation'
    );

    if (!res) return;

    let companyInfo = this.formDetails.value;

    companyInfo.region = companyInfo.region?.regDesc || '';
    companyInfo.province = companyInfo.province?.provDesc || '';
    companyInfo.municipality = companyInfo.municipality?.citymunDesc || '';
    companyInfo.barangay = companyInfo.barangay?.brgyDesc || '';

    const payload = {
      payload: this.us.encryptPayload(companyInfo)
    }


    this.ds.post('supervisor/profile', '', payload).subscribe(
      (response) => {
        console.log(response);
        this.gs.successAlert(response.title, response.message);

        let user = this.us.getUser();
        if (response.image) user.industry_partner.image = response.image;

        this.us.setUser(user);
      },
      (error) => {
        console.error(error);
        if (error.status == 422) {
          this.gs.makeAlert(
            'error',
            error.error.title || 'Invalid Input!',
            error.error.message || 'Your input is invalid.'
          );
        } else if (error.status == 409) {
          this.gs.makeAlert('error', error.error.title, error.error.message);
        } else {
          this.gs.makeAlert(
            'error',
            'Oops!',
            'Something went wrong, please try again later.'
          );
        }
      }
    );
  }

  async onRegionChange(region: any) {
    let regCode = region.regCode;
    this.provinces = [];
    this.municipalities = [];
    this.barangays = [];

    this.formDetails.patchValue({
      municipality: null,
      province: null,
      barangay: null,
    });

    this.provinces = await this.ls.getProvinces(regCode);
  }

  async onProvinceChange(province: any) {
    this.municipalities = [];
    this.barangays = [];

    this.formDetails.patchValue({
      municipality: null,
      barangay: null,
    });

    this.municipalities = await this.ls.getMunicipalities(province.provCode);
  }

  async onMunicipalityChange(municipality: any) {
    this.barangays = [];

    this.formDetails.patchValue({
      barangay: null,
    });

    this.barangays = await this.ls.getBarangays(municipality.citymunCode);
  }
}
