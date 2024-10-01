import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  displayedColumns: string[] = ['name', 'student_number', 'course', 'program', 'required_hours', 'time_completion', 'student_evaluation', 'exit_poll', 'status', 'actions'];

  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();
  
  classList: any = []
  statusFilter: string = 'all'
  classFilter: string = 'all'

  isLoading: boolean = false
  
  @ViewChild(MatPaginator, {static:true}) paginator!: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl, 
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private ds: DataService,
    private us: UserService
  ) {
    this.paginator = new MatPaginator(this.paginatorIntl, this.changeDetectorRef);
  }

  ngOnInit() {
    this.getStudents()
  }

  getStudents() {
    this.ds.get('supervisor/students').subscribe(
      students => {
        console.log(students)
        let studentsList = students.map((student: any) => {
          //get all classes
          if (!this.classList.includes(student.active_ojt_class.class_code)) 
            this.classList.push(student.active_ojt_class.class_code) 

          if(student.ojt_exit_poll) {
            student.ojt_exit_poll = "Answered"
          }

          if(student.student_evaluation) {
            student.student_evaluation = student.student_evaluation.average
          }

          let required_hours: number = student.active_ojt_class.required_hours
          let progress: number = 0

          //if has accomplishment report
          if(student.accomplishment_report.length > 0) {
            student.accomplishment_report = student.accomplishment_report[0]
            progress += parseInt(student.accomplishment_report.current_total_hours)
          }


          let status = (student.accepted_application) ? 'Ongoing' : 'Pending'

          if(progress >= required_hours && student.ojt_exit_poll && student.student_evaluation) {
            status = "Completed"
          }

          return {
            full_name: student.first_name + " " + student.last_name,
            progress,
            status,
            ...student
          } 
        })
        console.log(studentsList)

        this.unfilteredStudents = studentsList
        this.dataSource.data = studentsList
        this.dataSource.paginator = this.paginator;
      },
      error => {
        console.error(error)
      }
    )
  }

  onStatusFilterChange(value: string) {
    this.statusFilter = value
    this.applyFilter()
  }

  applyFilter() {
    //class filter
    let students = this.unfilteredStudents
    
    if(this.classFilter != 'all') {
      students = students.filter((student: any) => {
        return student.active_ojt_class.class_code === this.classFilter
      })
    }

    if(this.statusFilter != "all") {
      students = students.filter((student: any) => {
        return student.status.toLowerCase() === this.statusFilter
      })    
    }

    this.dataSource.data = students
  }

  viewStudent(id: number) {
    if(this.isLoading) {
      return
    }

    let studentDetails = this.unfilteredStudents.find((student: any) => student.id = id)

    console.log(studentDetails)
    this.ds.get('adviser/monitoring/students/', id).subscribe(
      student => {
        this.us.setStudentProfile({ ...student, required_hours: studentDetails.required_hours })
        this.router.navigate(['main/students/view'])
        this.isLoading = false
      },
      error => {
        console.error(error)
        this.isLoading = false
      }
    )
  }
}
