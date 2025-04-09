import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import {
  ImageCropperComponent,
  ImageCroppedEvent,
  LoadedImage,
} from 'ngx-image-cropper';
import { GeneralService } from '../../../../services/general.service';
import { DataService } from '../../../../services/data.service';
import { UserService } from '../../../../services/user.service';

@Component({
  selector: 'app-change-profile',
  templateUrl: './change-profile.component.html',
  styleUrl: './change-profile.component.scss',
})
export class ChangeProfileComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: any = null;
  isSubmitting: boolean = false;
  isUploaded: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<ChangeProfileComponent>,
    private gs: GeneralService,
    private ds: DataService,
    private us: UserService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // console.log(data)
  }

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
    this.isUploaded = true;
  }

  imageCropped(event: ImageCroppedEvent) {
    if (!event.objectUrl) return;

    this.getBlobFromObjectUrl(event.objectUrl)
      .then((blob: Blob) => {
        if (blob) {
          this.croppedImage = blob;
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    // event.blob can be used to upload the cropped image
  }

  async getBlobFromObjectUrl(objectUrl: string): Promise<Blob> {
    try {
      const response = await fetch(objectUrl);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const blob = await response.blob();
      return blob;
    } catch (error) {
      console.error('Error fetching or converting to Blob:', error);
      throw error;
    }
  }

  imageLoaded(image: LoadedImage) {
    // show cropper
  }

  cropperReady() {
    // cropper ready
  }

  loadImageFailed() {
    this.gs.makeAlert('error', 'Invalid Image!', 'Invalid file format.');
  }

  saveImage() {
    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const payload = new FormData();

    console.log(this.croppedImage);
    payload.append('image', this.croppedImage);
    this.ds.post('supervisor/profile/logo', '', payload).subscribe(
      (response) => {
        console.log(response);
        let user = this.us.getUser();
        console.log({ ...user, image: response.data.image });
        this.us.setUser({ ...user, industry_partner: {
          ...user.industry_partner,
          image: response.data.image
        } });

        this.gs.makeAlert('success', 'Uploaded!', 'Image has been uploaded. ');
        this.isSubmitting = false;
        this.dialogRef.close(response.data.image);
      },
      (error) => {
        console.error(error);
        if (error.status === 422) {
          this.gs.makeAlert(
            'error',
            'Invalid Input!',
            'Please upload a valid image.'
          );
        } else {
          this.gs.makeAlert(
            'error',
            'Oops!',
            'Something went wrong, Please try again later.'
          );
        }
        this.isSubmitting = false;
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close(null);
  }
}
