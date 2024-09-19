import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewRoutingModule } from './view-routing.module';
import { ViewComponent } from './view.component';
import { StudentprofileComponent } from './components/studentprofile/studentprofile.component';
import { DailyattendanceComponent } from './components/dailyattendance/dailyattendance.component';
import { WeeklyreportComponent } from './components/weeklyreport/weeklyreport.component';


@NgModule({
  declarations: [
    // ViewComponent,
    StudentprofileComponent,
    DailyattendanceComponent,
    WeeklyreportComponent
  ],
  imports: [
    CommonModule,
    ViewRoutingModule
  ]
})
export class ViewModule { }
