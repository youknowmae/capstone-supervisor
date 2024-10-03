import { Component } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { DataService } from '../../../../../../../services/data.service';
import { UserService } from '../../../../../../../services/user.service';

@Component({
  selector: 'app-studentprofile',
  templateUrl: './studentprofile.component.html',
  styleUrl: './studentprofile.component.scss'
})
export class StudentprofileComponent {
  student: any

  constructor(
    private ds: DataService,
    private us: UserService
  ) {
  }

  ngOnInit() {
    this.getStudent()
  }

  getStudent() {
    this.student = this.us.getStudentProfile()
    console.log(this.student)
  }
}
