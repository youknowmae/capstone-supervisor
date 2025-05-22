import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';

import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { DataService } from '../../../../../services/data.service';
import { UserService } from '../../../../../services/user.service';

import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class ListComponent {
  displayedColumns: string[] = [
    'full_name',
    'email',
    'mobile',
    'progress',
    'student_evaluation',
    'status',
    'actions',
  ];

  unfilteredStudents: any;
  dataSource: any = new MatTableDataSource<any>();

  statusFilter: string = 'all';

  isLoading: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

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

    const studentNumberFilterPredicate = (
      data: any,
      search: string
    ): boolean => {
      return data.email.toLowerCase().includes(search);
    };

    const filterPredicate = (data: any, search: string): boolean => {
      return (
        nameFilterPredicate(data, search) ||
        studentNumberFilterPredicate(data, search)
      );
    };

    this.dataSource.filterPredicate = filterPredicate;
  }

  ngOnInit() {
    this.getStudents();
  }

  search(search: string) {
    this.dataSource.filter = search.trim().toLowerCase();
  }

  getStudents() {
    this.ds.get('supervisor/students').subscribe(
      (students) => {
        console.log(students);
        let studentsList = students.map((student: any) => {
          student.email = student.email + '@gordoncollege.edu.ph';

          if (student.student_evaluation) {
            student.student_evaluation = student.student_evaluation.average;
          }

          const ojtClass = {
            ...student.ojt_class.adviser_class,
            ...student.ojt_class.adviser_class.active_ojt_hours,
          };

          const required_hours: number = ojtClass.required_hours;
          let progress: number = 0;

          //if has accomplishment report
          if (student.verified_attendance_total) {
            progress += parseInt(
              student.verified_attendance_total.current_total_hours
            );
            if (progress > required_hours) progress = required_hours;
          }

          let status =
            progress >= required_hours && student.student_evaluation
              ? 'Completed'
              : 'Ongoing';

          return {
            full_name: student.first_name + ' ' + student.last_name,
            progress,
            status,
            required_hours,
            ...student,
          };
        });
        console.log(studentsList);

        this.unfilteredStudents = studentsList;
        this.dataSource.data = studentsList;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onStatusFilterChange(value: string) {
    this.statusFilter = value;
    this.applyFilter();
  }

  applyFilter() {
    let students = this.unfilteredStudents;

    if (this.statusFilter != 'all') {
      students = students.filter((student: any) => {
        return student.status.toLowerCase() === this.statusFilter;
      });
    }

    this.dataSource.data = students;
  }

  viewStudent(id: number) {
    if (this.isLoading) {
      return;
    }

    this.isLoading = true;

    let studentDetails = this.unfilteredStudents.find(
      (student: any) => (student.id = id)
    );

    this.ds.get('supervisor/students/', id).subscribe(
      (student) => {
        console.log(studentDetails);
        this.us.setStudentProfile({
          ...student,
          required_hours: studentDetails.required_hours,
        });

        this.router.navigate(['main/student/view']);
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
        this.isLoading = false;
      }
    );
  }

  evaluateStudent(student: any) {
    let gender = '';
    let pronoun = '';
    if (student.gender == 0) {
      gender = 'Ms.';
      pronoun = 'her';
    } else if (student.gender == 1) {
      gender = 'Mr.';
      pronoun = 'his';
    }

    this.us.setStudentEvaluation({
      id: student.id,
      name: student.full_name,
      gender,
      pronoun,
      supervisor_name:
        student.accepted_application.industry_partner.immediate_supervisor,
      start_date: student.accepted_application.start_date,
      end_date: student.last_verified_attendance.date,
      ojt_hours: student.progress,
    });

    this.router.navigate(['main/student/evaluation']);
  }
}
