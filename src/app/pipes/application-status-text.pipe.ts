import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'applicationStatusText',
})
export class ApplicationStatusTextPipe implements PipeTransform {
  transform(status: number): unknown {
    if (status == 3) {
      return 'For Approval';
    } else if (status == 4) {
      return 'Declined';
    } else if (status == 5) {
      return 'For Schedule';
    } else if (status == 6) {
      return 'Reschedule';
    } else if (status == 7) {
      return 'For Interview';
    } else if (status == 8) {
      return 'Accepted';
    } else {
      return 'Invalid Status';
    }
  }
}
