import { Component } from '@angular/core';
import { DataService } from '../../../../../../../services/data.service';
import { GeneralService } from '../../../../../../../services/general.service';
import { UserService } from '../../../../../../../services/user.service';
import { AcademicYear } from '../../../../../../../models/academicYear.model';

@Component({
  selector: 'app-weeklyreport',
  templateUrl: './weeklyreport.component.html',
  styleUrl: './weeklyreport.component.scss',
})
export class WeeklyreportComponent {
  weekly_attendance: any = [];
  isLoading: boolean = true;

  constructor(
    private ds: DataService,
    private us: UserService,
    private gs: GeneralService
  ) {}

  ngOnInit() {
    this.getStudent();
  }

  getStudent() {
    let student = this.us.getStudentProfile();

    console.log(student);
    this.getAttendance(student.id);
  }

  getAttendance(id: number) {
    const acadYear: AcademicYear = this.us.getSelectedAcademicYears();

    this.ds
      .get(
        `superadmin/students/attendance/${id}`,
        `?acad_year=${acadYear.acad_year}&semester=${acadYear.semester}`
      )
      .subscribe(
        (response) => {
          console.log(response);
          this.isLoading = false;

          this.computeWeeklyAttendance(response);
          // this.weekly_attendance = response
        },
        (error) => {
          console.error(error);
        }
      );
  }

  groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
    arr.reduce((groups, item) => {
      (groups[key(item)] ||= []).push(item);
      return groups;
    }, {} as Record<K, T[]>);

  computeWeeklyAttendance(data: any) {
    let weeklyAttendance: any = this.groupBy(
      data,
      (item: any) => item.week_of_year
    );

    weeklyAttendance = Object.entries(weeklyAttendance).map(
      ([week, accomplishment_report]: [string, any]) => {
        var accumulated_hours: number = 0;

        accomplishment_report.forEach((report: any) => {
          accumulated_hours += report.total_hours;
        });

        return { week, accomplishment_report, accumulated_hours };
      }
    );

    this.weekly_attendance = weeklyAttendance;
    console.log(this.weekly_attendance);
  }
}
