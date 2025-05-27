import Swal, { SweetAlertIcon } from 'sweetalert2';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GeneralService {
  errorToastAlert(title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'error',
      title,
    });
  }

  successToastAlert(title: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
      },
    });
    Toast.fire({
      icon: 'success',
      title,
    });
  }

  errorAlert(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'error',
      timer: 3000,
      showConfirmButton: false,
      // confirmButtonText: 'Close',
      // confirmButtonColor: "#777777",
      // scrollbarPadding: false,
    });
  }

  makeAlert(icon: SweetAlertIcon, title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon,
      timer: 3000,
      showConfirmButton: false,
    });
  }

  successAlert(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'success',
      timer: 3000,
      showConfirmButton: false,
      // confirmButtonText: 'Close',
      // confirmButtonColor: "#777777",
      // scrollbarPadding: false,
    });
  }

  infoAlert(title: string, text: string) {
    Swal.fire({
      title,
      text,
      icon: 'info',
      // timer: 4000,
      showConfirmButton: true,
      confirmButtonText: 'Close',
      confirmButtonColor: '#3fc3ee',
      scrollbarPadding: false,
    });
  }

  async confirmationAlert(
    title: string,
    text: string,
    icon: SweetAlertIcon,
    confirmButtonText: string = 'Yes',
    type: 'destructive' | 'confirmation' = 'destructive'
  ) {
    let alert: Promise<boolean> = Swal.fire({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText: 'No',
      confirmButtonColor: type === 'destructive' ? '#AB0E0E' : '#527853',
      cancelButtonColor: '#777777',
      heightAuto: false,
    }).then((res: any) => {
      if (res.value) {
        return true;
      }
      return false;
    });

    return alert;
  }

  promptConfirmationAlert(title: string, text: string, icon: SweetAlertIcon) {
    let swalInstance = Swal.mixin({
      title,
      text,
      icon,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      confirmButtonColor: '#AB0E0E',
      cancelButtonColor: '#777777',
    });
    return swalInstance;
  }
}
