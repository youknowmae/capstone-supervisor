import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { ListComponent } from './components/list/list.component';
import { ViewComponent } from './components/view/view.component';
import { StudentEvaluationComponent } from './components/student-evaluation/student-evaluation.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path:'list', component: ListComponent },
  { path: 'evaluation', component: StudentEvaluationComponent},
  { path:'view', 
    component: ViewComponent, 
    loadChildren: () => import('./components/view/view.module').then(m => m.ViewModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentRoutingModule { }
