import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationComponent } from './application.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { AcceptmodalComponent } from './components/acceptmodal/acceptmodal.component';
import { SchedulemodalComponent } from './components/schedulemodal/schedulemodal.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ListComponent },
  { path: 'view', component: ViewComponent },
  { path: 'acceptmodal', component: AcceptmodalComponent },
  { path: 'schedulemodal', component: SchedulemodalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationRoutingModule { }
