import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent }  ,
  { path: 'student', loadChildren: () => import('./components/student/student.module').then(m => m.StudentModule) },
  { path: 'application', loadChildren: () => import('./components/application/application.module').then(m => m.ApplicationModule) }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
}) 
export class MainRoutingModule { }
