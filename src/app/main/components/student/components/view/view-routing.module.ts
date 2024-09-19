import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewComponent } from './view.component';
import { StudentprofileComponent } from './components/studentprofile/studentprofile.component';
import { WeeklyreportComponent } from './components/weeklyreport/weeklyreport.component';
import { DailyattendanceComponent } from './components/dailyattendance/dailyattendance.component';

const routes: Routes = [
  { path: '', redirectTo: 'studentprofile', pathMatch: 'full' },
  { path: 'studentprofile', component: StudentprofileComponent },
  { path: 'weeklyreport', component: WeeklyreportComponent },
  { path: 'dailyattendance', component: DailyattendanceComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule { }
