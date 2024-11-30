import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { ApplicationComponent } from './components/application/application.component';
import { SettingsComponent } from './components/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: ProfileComponent }  ,
  { path: 'student', loadChildren: () => import('./components/student/student.module').then(m => m.StudentModule) },
  { path: 'applications', 
    component: ApplicationComponent,
    loadChildren: () => import('./components/application/application.module').then(m => m.ApplicationModule) 
  },
  { path: 'settings', component: SettingsComponent }  ,
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
}) 
export class MainRoutingModule { }
