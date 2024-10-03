import { DataSource } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { DataService } from '../../../../../../../services/data.service';
import { UserService } from '../../../../../../../services/user.service';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { GeneralService } from '../../../../../../../services/general.service';

@Component({
  selector: 'app-dailyattendance',
  templateUrl: './dailyattendance.component.html',
  styleUrl: './dailyattendance.component.scss'
})
export class DailyattendanceComponent {
  displayedColumns: string[] = ['date', 'arrival_time', 'departure_time', 'total_hours', 'actions'];

  dataSource: any = new MatTableDataSource<any>();
  progress = {
    total_hours: 0,
    required_hours: 0,
    remarks: ''
  }
  unverified_attendance: number = 0
  
  isVerifying: boolean = false

  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private ds: DataService,
    private us: UserService,
    private gs: GeneralService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }
  
  ngOnInit() {
    this.getStudent()
  }

  getStudent() {
    let student = this.us.getStudentProfile()
    this.progress.required_hours = student.required_hours

    console.log(student)
    this.getAttendance(student.id)
  }

  getAttendance(id: number) {
    this.ds.get('supervisor/students/attendance/', id).subscribe(
      response => {
        console.log(response)

        this.dataSource.data = response;
        this.dataSource.paginator = this.paginator;
        
        this.tallyProgress()
      },
      error => {
        console.error(error)
      }
    )

  }

  tallyProgress() {
    this.progress.total_hours = 0
    this.unverified_attendance = 0 

    let data = this.dataSource.data

    data.forEach((attendance: any) => {
      if(attendance.is_verified)
        this.progress.total_hours += attendance.total_hours 
      else 
        this.unverified_attendance += 1
    });

    if(this.progress.total_hours >= this.progress.required_hours) 
      this.progress.remarks = ' - Completed'
    
  }

  verifyAttendance(id: number) {
    if(this.isVerifying) {
      return
    }

    this.isVerifying = true
    this.ds.get('supervisor/students/attendance/verify/', id).subscribe(
      response => {
        let data = this.dataSource.data 
        data = data.map((data: any) => {
          if(data.id === id) {
            data.is_verified = 1
          }
          
          return data
        })
        console.log(response)
        this.gs.successToastAlert(response.message)
        this.isVerifying = false
        
        this.tallyProgress()
      },
      error => {
        console.error(error)
        this.isVerifying = false
      }
    )
  }

  verifyAllAttendance() {
    let student = this.us.getStudentProfile()
    let id = student.id
    
    if(this.isVerifying) {
      return
    }

    this.isVerifying = true
    this.ds.get('supervisor/students/attendance/verify/all/', id).subscribe(
      response => {
        let data = this.dataSource.data 
        data = data.map((data: any) => {
          data.is_verified = 1
  
          return data
        })
        console.log(response)
        this.gs.successToastAlert(response.message)
        this.isVerifying = false
        
        this.tallyProgress()
      },
      error => {
        console.error(error)
        this.isVerifying = false
      }
    )
  }
}
