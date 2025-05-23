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
  styleUrl: './list.component.scss',
})
export class ListComponent {
  displayedColumns: string[] = [
    'name',
    'email',
    'mobile',
    'required_hours',
    'application_date',
    'status',
    'actions',
  ];

  unfilteredStudents: any;
  dataSource: any = new MatTableDataSource<any>();

  classList: any = [];
  statusFilter: any = '';
  // classFilter: string = 'all'

  isLoading: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private paginatorIntl: MatPaginatorIntl,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private ds: DataService,
    private us: UserService
  ) {
    this.paginator = new MatPaginator(
      this.paginatorIntl,
      this.changeDetectorRef
    );

    const nameFilterPredicate = (data: any, search: string): boolean => {
      return data.full_name.toLowerCase().includes(search);
    };

    const emailFilterPredicate = (data: any, search: string): boolean => {
      // return data.student_profile.student_number.toLowerCase().includes(search);
      return data.email.toLowerCase().includes(search);
    };

    const filterPredicate = (data: any, search: string): boolean => {
      return (
        nameFilterPredicate(data, search) || emailFilterPredicate(data, search)
      );
    };
  }

  ngOnInit() {
    this.getApplications();
  }

  search(search: string) {
    this.dataSource.filter = search.trim().toLowerCase();
  }

  getApplications() {
    this.ds.get('supervisor/applications').subscribe(
      (students) => {
        console.log(students);
        let studentsList = students
          .map((student: any) => {
            student.user.email = student.user.email + '@gordoncollege.edu.ph';

            return {
              full_name: student.user.first_name + ' ' + student.user.last_name,
              ...student.user,
              created_at: student.created_at,
              id: student.id,
              status: student.status,
            };
          })
          .filter((student: any) => student.status != 8);

        console.log(studentsList);

        this.unfilteredStudents = studentsList;
        this.dataSource.data = studentsList;
        this.dataSource.paginator = this.paginator;

        this.applyFilter();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onStatusFilterChange(event: MatSelectChange) {
    //3 = pending, 4 = rejected, 5 = accepted
    this.statusFilter = event.value;

    this.applyFilter();
  }

  applyFilter() {
    //class filter
    let students = this.unfilteredStudents;

    if (this.statusFilter) {
      students = students.filter((student: any) => {
        return student.status == this.statusFilter;
      });
    }

    this.dataSource.data = students;
  }

  viewStudent(id: number) {
    this.us.setStudentApplication(id);
    this.router.navigate(['main/applications/view']);
  }
}
