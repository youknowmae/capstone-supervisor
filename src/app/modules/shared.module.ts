import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationStatusTextPipe } from '../pipes/application-status-text.pipe';

@NgModule({
  declarations: [ApplicationStatusTextPipe],
  exports: [ApplicationStatusTextPipe],
  imports: [CommonModule],
})
export class SharedModule {}
