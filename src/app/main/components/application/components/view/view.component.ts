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
    
    

    this.applicationDetails = {
      id: application.id, 
      status: application.status, 
      student: {
        email: application.user.email, 
        full_name: application.user.first_name + " " + application.user.last_name,
        ...application.user.student_profile,
        skills: application.user.student_skills?.skills
      },
      documents: application.application_documents
    }
      
    this.applicationDetails.student.skills = [
      { strong_skill: '', weak_skill: '' },
      { strong_skill: '', weak_skill: '' },
      { strong_skill: '', weak_skill: '' }
    ]
    console.log(this.applicationDetails)
  }

  previewDocument(file: any) {
    this.dialogRef.open(PdfPreviewComponent, {
      data: { name: file.file_name, pdf: file.file_location},
      disableClose: true
    })
  }

  approveApplication() {
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
        // this.apply()
        this.ds.get('supervisor/applications/accept/', this.applicationDetails.id).subscribe(
          response => {
            this.gs.successAlert(response.title, response.message)
            this.applicationDetails.status = 4
          },
          error => {
            console.error(error)
          }
        )
        console.log(this.applicationDetails)
      }
    });
  }

}
