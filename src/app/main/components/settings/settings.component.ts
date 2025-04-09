import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from '../../../services/data.service';
import { GeneralService } from '../../../services/general.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  passwordDetails: FormGroup;
  showOldPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  isSubmitting: boolean = false;

  constructor(
    private fb: FormBuilder,
    private ds: DataService,
    private gs: GeneralService
  ) {
    this.passwordDetails = this.fb.group({
      current_password: [null, [Validators.required]],
      new_password: [null, [Validators.required, Validators.minLength(8)]],
      password_confirmation: [
        null,
        [Validators.required, Validators.minLength(8)],
      ],
    });
  }

  changePasswordConfirmation() {
    let alert = this.gs.promptConfirmationAlert(
      'Submit?',
      'you want to change your password?',
      'question'
    );
    alert.fire().then((result) => {
      if (result.isConfirmed) {
        this.changePassword();
      }
    });
  }

  changePassword() {
    if (this.passwordDetails.invalid) {
      const firstInvalidControl: HTMLElement =
        document.querySelector('form .ng-invalid')!;

      if (firstInvalidControl) {
        firstInvalidControl.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }

      this.passwordDetails.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    const new_password = this.passwordDetails.get('new_password')?.value;
    const confirm_password = this.passwordDetails.get(
      'password_confirmation'
    )?.value;

    if (new_password != confirm_password) {
      this.gs.errorAlert(
        "Password Doesn't Match!",
        'Please double check you inputs.'
      );
      return;
    }

    console.log(this.passwordDetails.value);
    this.ds
      .post(
        'supervisor/profile/change-password',
        '',
        this.passwordDetails.value
      )
      .subscribe(
        (response) => {
          this.gs.successAlert(response.title, response.message);
          this.passwordDetails.reset(this.passwordDetails.value);
          this.isSubmitting = false;
        },
        (error) => {
          this.isSubmitting = false;
          if (error.status === 422) {
            this.gs.errorAlert(
              'Invalid Input!',
              'Please double check you inputs.'
            );
          } else if (error.status === 403) {
            this.gs.errorAlert(error.error.title, error.error.message);
          }

          console.error(error);
        }
      );
  }
}
