import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentRoutingModule } from './student-routing.module';
import { StudentComponent } from './student.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { StudentEvaluationComponent } from './components/student-evaluation/student-evaluation.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    // StudentComponent,
    ListComponent,
    ViewComponent,
    StudentEvaluationComponent
  ],
  imports: [
    CommonModule,
    StudentRoutingModule,
    MaterialsModules,
    ReactiveFormsModule
  ]
})
export class StudentModule { }
