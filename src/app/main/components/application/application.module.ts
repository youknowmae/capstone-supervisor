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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    // ApplicationComponent,
    ListComponent,
    ViewComponent,
    AcceptmodalComponent,
    SchedulemodalComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MaterialsModules,
    MatDialogModule,
    BrowserAnimationsModule
  ]
})
export class ApplicationModule { }
