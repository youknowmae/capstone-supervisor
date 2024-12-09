import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { AcceptmodalComponent } from './components/acceptmodal/acceptmodal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SchedulemodalComponent } from './components/schedulemodal/schedulemodal.component';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // Import this module
import { ReactiveFormsModule } from '@angular/forms';
import { ScheduleDetailsModalComponent } from './components/schedule-details-modal/schedule-details-modal.component';


@NgModule({
  declarations: [
    // ApplicationComponent,
    ListComponent,  
    ViewComponent,
    AcceptmodalComponent,
    SchedulemodalComponent,
    ScheduleDetailsModalComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MaterialsModules,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule
  ]
})
export class ApplicationModule { }
