import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationRoutingModule } from './application-routing.module';
import { ApplicationComponent } from './application.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { MaterialsModules } from '../../../modules/materials.module';


@NgModule({
  declarations: [
    // ApplicationComponent,
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    ApplicationRoutingModule,
    MaterialsModules
  ]
})
export class ApplicationModule { }
