import { Component } from '@angular/core';
import { GeneralService } from '../../../../../services/general.service';
import { UserService } from '../../../../../services/user.service';
import { PdfPreviewComponent } from '../../../../../components/pdf-preview/pdf-preview.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss'
})
export class ViewComponent {
  applicationDetails: any = null
  comments: any = []

  constructor(
    // private ds: DataService,
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
        skills: application.user.student_skills.skills
      },
      documents: application.application_documents
    }
      
    console.log(this.applicationDetails)
  }

  previewDocument(file: any) {
    this.dialogRef.open(PdfPreviewComponent, {
      data: { name: file.file_name, pdf: file.file_location},
      disableClose: true
    })
  }

}
