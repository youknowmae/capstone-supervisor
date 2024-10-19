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

  displayedColumns: string[] = ['name', 'email', 'mobile', 'course', 'program', 'required_hours', 'status', 'actions'];

  unfilteredStudents: any
  dataSource: any = new MatTableDataSource<any>();
  
  classList: any = []
  statusFilter: number | null = 3
  // classFilter: string = 'all'

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
    this.getApplications()
  }

  getApplications() {
    this.ds.get('supervisor/applications').subscribe(
      students => {
        console.log(students)
        let studentsList = students.map((student: any) => {

          let status_label 

          if (student.status == 3) 
            status_label = 'Pending';
          else if (student.status == 4) 
            status_label = 'Rejected';
          else if (student.status == 5) 
            status_label = 'Accepted';
          

          return {
            full_name: student.user.first_name + " " + student.user.last_name,
            // progress,
            status: student.status,
            label: status_label,
            ...student.user,
            id: student.id, 
          } 
        })  
        console.log(studentsList)

        this.unfilteredStudents = studentsList
        this.dataSource.data = studentsList
        this.dataSource.paginator = this.paginator;

        this.applyFilter()
      },
      error => {
        console.error(error)
      }
    )
  }

  onStatusFilterChange(event: MatSelectChange) {
    //3 = pending, 4 = rejected, 5 = accepted
    this.statusFilter = event.value

    this.applyFilter()
  }

  applyFilter() {
    //class filter
    let students = this.unfilteredStudents
    
    if(this.statusFilter) {
      students = students.filter((student: any) => {
        return student.status == this.statusFilter
      })
    } 

    this.dataSource.data = students
  }

  viewStudent(id: number) {
    console.log(id)
    this.ds.get('supervisor/applications/', id).subscribe(
      application => {
        this.us.setStudentApplication(application)
        this.router.navigate(['main/applications/view'])
        console.log(application)
      },
      error => {
        console.error(error)
      }
    )
  }
}
