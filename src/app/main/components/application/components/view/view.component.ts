import { Component } from '@angular/core';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { PdfPreviewComponent } from '../../../../../components/pdf-preview/pdf-preview.component';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { DataService } from '../../../../../services/data.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  applicationDetails: any = null
  comments: any = []

  constructor(
    private ds: DataService,
    // private route: ActivatedRoute,
    private dialogRef: MatDialog,
    private gs: GeneralService,
    private us: UserService
  ) { 
  }

  ngOnInit() {
    this.getApplicationDetails()
  }

  getApplicationDetails() {
    let application = this.us.getStudentApplication()
    
    this.comments = application.application_comments.map((element: any) => {

      if(element.supervisor) 
        element.supervisor = JSON.parse(element.supervisor.immediate_supervisor)

      console.log(element.supervisor.first_name)
      return element
    });


    console.log(this.comments)
    // this.comments = application.application_comments.map(
    //   (item: any) => {
    //     console.log(item)
    //   }
    // )

    this.applicationDetails = {
      id: application.id, 
      status: application.status, 
      student: {
        email: application.user.email, 
        full_name: application.user.first_name + " " + application.user.last_name,
        ...application.user.student_profile,
        skills: application.user.student_skills?.skills,
        ...application.user.active_ojt_class
      },
      documents: application.application_documents
    }

    console.log(application)
    if(application.application_endorsement)
      this.applicationDetails.documents.unshift(application.application_endorsement)
      
    if(this.applicationDetails.student.skills.length == 0)
      this.applicationDetails.student.skills = [
        { strong_skill: '', weak_skill: '' },
        { strong_skill: '', weak_skill: '' },
        { strong_skill: '', weak_skill: '' }
      ]
  }

  previewDocument(file: any) {
    this.dialogRef.open(PdfPreviewComponent, {
      data: { name: file.file_name, pdf: file.file_location},
      disableClose: true
    })
  }

  acceptApplication() {
    Swal.fire({
      title: "Accept?",
      text: "Are you sure you want to accept this application?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#4f6f52",
      cancelButtonColor: "#777777",
    }).then((result) => {
      if (result.isConfirmed) {
        this.ds.get('supervisor/applications/accept/', this.applicationDetails.id).subscribe(
          response => {
            this.gs.successAlert(response.title, response.message)
            this.applicationDetails.status = 5
          },
          error => {
            console.error(error)
          }
        )
        console.log(this.applicationDetails)
      }
    });
  }

  rejectApplication() {
    Swal.fire({
      title: "Please state the reason for rejection?",
      // text: "Are you sure you want to reject this application?",
      // icon: "info",
      input: "text",
      inputAttributes: {
        autocapitalize: "off"
      },
      showCancelButton: true,
      confirmButtonText: 'Reject',
      cancelButtonText: 'Cancel',
      confirmButtonColor: "#ff4141",
      cancelButtonColor: "#777777",
    }).then((result) => {
      console.log(result)
      if (result.isConfirmed) {
        const formData = new FormData
        formData.append('message', result.value)
        this.ds.post('supervisor/applications/reject/', this.applicationDetails.id, formData).subscribe(
          response => {
            this.gs.errorAlert(response.title, response.message)
            this.applicationDetails.status = 4
          },
          error => {
            console.error(error)
            if(error.status = 422) {
              
              this.gs.errorAlert(error.error.title, error.error.message)
            }
          }
        )
        console.log(this.applicationDetails)
      }
    });
  }

}
