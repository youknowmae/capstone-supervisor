import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { StudentComponent } from './components/student/student.component';
import { ApplicationComponent } from './components/application/application.component';


@NgModule({
  declarations: [
    ApplicationComponent,
    ProfileComponent,
    StudentComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule
  ]
})
export class MainModule { }
