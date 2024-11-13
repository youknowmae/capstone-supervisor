import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './main/main.component';
import { LoginComponent } from './components/login/login.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { PdfPreviewComponent } from './components/pdf-preview/pdf-preview.component';
import { MaterialsModules } from './modules/materials.module';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    PdfPreviewComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxDocViewerModule,
    MaterialsModules
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
