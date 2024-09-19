import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';


@NgModule({
  declarations: [
    // StudentComponent,
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule
  ]
})
export class StudentModule { }
