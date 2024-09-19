import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';

const routes: Routes = [
  // { path: '', redirectTo: 'main', pathMatch: 'full' },
  // { path: 'student', loadChildren: () => import('./components/student/student.module').then(m => m.StudentModule) },
  // { path: 'view', loadChildren: () => import('./components/student/components/view/view.module').then(m => m.ViewModule) }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
