import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { StudentComponent } from './components/student/student.component';
import { ApplicationComponent } from './components/application/application.component';
import { MaterialsModules } from '../modules/materials.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SettingsComponent } from './components/settings/settings.component';


@NgModule({
  declarations: [
    ApplicationComponent,
    ProfileComponent,
    StudentComponent,
    SettingsComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    MaterialsModules,
    ReactiveFormsModule
  ]
})
export class MainModule { }
