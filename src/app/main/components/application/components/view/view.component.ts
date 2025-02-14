import { Component, Input, Output, EventEmitter } from '@angular/core';import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { PdfPreviewComponent } from '../../../../../components/pdf-preview/pdf-preview.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';
import { AcceptmodalComponent } from '../acceptmodal/acceptmodal.component';
import { SchedulemodalComponent } from '../schedulemodal/schedulemodal.component';
import { ScheduleDetailsModalComponent } from '../schedule-details-modal/schedule-details-modal.component';
import { Router } from '@angular/router';
import { OJTInfoComponent } from '../ojtinfo/ojtinfo.component';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  isLoading: boolean = true
  applicationDetails: any = null;
  comments: any = [];
  logo: any = null;

  constructor(
    private ds: DataService,
    private dialog: MatDialog,
    private gs: GeneralService,
    private us: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getApplicationDetails();
  }

  getApplicationDetails() {
    let id = this.us.getStudentApplication();


    this.ds.get('supervisor/applications/', id).subscribe(
      application => {
        console.log(application)

        application.application_comments.forEach((element: any) => {
          if (element.supervisor) {
            let name = JSON.parse(element.supervisor.immediate_supervisor);
    
            this.comments.push({
              ...name,
              image: element.supervisor.image,
              message: element.message,
            });
          }
        });
    
        console.log(this.comments);
    
        if(application.status == 4) {
          application.status_text = 'Not Approved'
        }
        else if (application.status == 5) {
          application.status_text = 'For Schedule';
        }
        else if (application.status == 8) {
          application.status_text = 'Accepted';
        }

        this.applicationDetails = {
          id: application.id,
          status: application.status,
          student: {
            email: application.user.email,
            full_name:
              application.user.first_name + ' ' + application.user.last_name,
            ...application.user.student_profile,
            skills: application.user.student_skills?.skills,
            ...application.user.active_ojt_class,
            image: application.user.image,
          },
          documents: application.application_documents,
          interview_schedules: application.interview_schedules,
          status_text: application.status_text,
          rejection_remarks: application.rejection_remarks,
          start_date: application.start_date,
          department: application.department,
          task: application.task,
        };
    
        console.log(application);
        if (application.application_endorsement)
          this.applicationDetails.documents.unshift(
            application.application_endorsement
          );
    
        if (this.applicationDetails.student.skills == null)
          this.applicationDetails.student.skills = [
            { strong_skill: '', weak_skill: '' },
            { strong_skill: '', weak_skill: '' },
            { strong_skill: '', weak_skill: '' },
          ];

        
        
        this.isLoading = false
      },
      error => {
        this.isLoading = false
        console.error(error)
        if(error.status === 404) {
          this.router.navigate(['main/applications/list'])
          this.gs.errorAlert('Not Found!', 'Application not found.')
        }
        else {
          this.gs.errorAlert('Oops!', 'Something went wrong. Please try again later.')
        }
      }
    )

  }

  previewDocument(file: any) {
    this.dialog.open(PdfPreviewComponent, {
      data: { name: file.file_name, pdf: file.file_location },
      disableClose: true,
    });
  }

  acceptApplication() {
    const dialogRef = this.dialog.open(OJTInfoComponent, {
      width: '400px',
      disableClose: true, 
      data: { id: this.applicationDetails.id }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.applicationDetails.start_date =  result.start_date,
        this.applicationDetails.department = result.department,
        this.applicationDetails.task = result.task,
        this.applicationDetails.status = 8;
        this.applicationDetails.status_text = 'Accepted';
      }
    });
    
    // Swal.fire({
    //   title: 'Accept?',
    //   text: 'Are you sure you want to accept this application?',
    //   icon: 'info',
    //   showCancelButton: true,
    //   confirmButtonText: 'Yes',
    //   cancelButtonText: 'Cancel',
    //   confirmButtonColor: '#4f6f52',
    //   cancelButtonColor: '#777777',
    // }).then((result) => {
    //   if (result.isConfirmed) {
        // this.ds.get('supervisor/applications/accept/', this.applicationDetails.id).subscribe(
        //   (response) => {
        //     this.gs.successAlert(response.title, response.message);
        //     this.applicationDetails.status = 8;
        //     this.applicationDetails.status_text = 'Accepted';
        //   },
        //   (error) => {
        //     console.error(error);
        //   }
        // );
    //     console.log(this.applicationDetails);
    //   }
    // });
  }

  rejectApplication() {
    Swal.fire({
      title: 'Please state the reason for not accepting.',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off',
      },
      showCancelButton: true,
      confirmButtonText: 'Not Approved',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ff4141',
      cancelButtonColor: '#777777',
    }).then((result) => {
      console.log(result);
      if (result.isConfirmed) {
        if(result.value.trim().length === 0) {
          this.gs.errorAlert('Invalid input!', 'Please give the reason for not accepting.');
          return
        }

        const formData = new FormData();
        formData.append('message', result.value);
        this.ds.post('supervisor/applications/reject/', this.applicationDetails.id, formData).subscribe(
          (response) => {
            this.gs.successAlert(response.title, response.message);
            this.applicationDetails.status = 4;
          },
          (error) => {
            console.error(error);
            if ((error.status = 422)) {
              this.gs.errorAlert(error.error.title, error.error.message);
            }
          }
        );
        console.log(this.applicationDetails);
      }
    });
  }

  openAcceptModal() {
    const dialogRef = this.dialog.open(AcceptmodalComponent, {
      disableClose: true, // Prevents closing on outside click
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result === 'interview') {
        this.forInterview();
      } else if (result === 'accepted') {
        this.acceptApplication();
      }
    });
  }
  
  forInterview() {
    let dialog = this.dialog.open(SchedulemodalComponent, {
      width: '400px', 
      disableClose: true,
      data: { id: this.applicationDetails.id}
    });

    dialog.afterClosed().subscribe((result) => {
      if(!result) {
        return
      }
      if (result.action === 'scheduled') {
        this.applicationDetails.status = 4;
        this.applicationDetails.interview_schedules.unshift(result.data)
      } 
    });
    
  }


  formatTime(time: string): string {
    const [hours, minutes, seconds] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  }

  openScheduleDetailsModal(data: any) {
    this.dialog.open(ScheduleDetailsModalComponent, {
      width: '400px',        
      disableClose: true,  
      data: data
    });
  }
}
