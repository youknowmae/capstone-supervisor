import { DataSource } from '@angular/cdk/collections';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dailyattendance',
  templateUrl: './dailyattendance.component.html',
  styleUrl: './dailyattendance.component.scss'
})
export class DailyattendanceComponent {
  displayedColumns = []

  dataSource: any
  progress = {
    total_hours: 0,
    required_hours: 0,
    remarks: ''
  }
}
