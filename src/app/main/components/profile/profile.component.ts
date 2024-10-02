import { Component } from '@angular/core';
import { GeneralService } from '../../../services/general.service';
import { FormBuilder } from '@angular/forms';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  industryPartner: any
  dataSource: any
  displayedColumns: any

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService
  ) {
  }

  ngOnInit() {
    this.getCompanyProfile()
  }

  getCompanyProfile() {
    this.ds.get('supervisor/profile').subscribe(
      profile => {
        console.log(profile )
      },
      error => {
        console.error(error)
      }
    )
  }
}
