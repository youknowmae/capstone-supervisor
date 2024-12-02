import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { MaterialsModules } from '../../../modules/materials.module';
import { AcceptmodalComponent } from './components/acceptmodal/acceptmodal.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    // ApplicationComponent,
    ListComponent,
    ViewComponent,
    AcceptmodalComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MaterialsModules,
    MatDialogModule
  ]
})
export class ApplicationModule { }
