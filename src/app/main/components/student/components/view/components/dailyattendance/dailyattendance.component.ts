import { DataSource } from '@angular/cdk/collections';
import { Component } from '@angular/core';

@Component({
  selector: 'app-dailyattendance',
  templateUrl: './dailyattendance.component.html',
  styleUrl: './dailyattendance.component.scss'
})
export class DailyattendanceComponent {
  displayedColumns: string[] = ['date', 'arrival_time', 'departure_time', 'total_hours', 'actions'];

  dataSource: any
  progress = {
    total_hours: 0,
    required_hours: 0,
    remarks: ''
  }

  verifyAttendance(id: number) {

  }

  verifyAllAttendance(id: number) {
    
  }
}
