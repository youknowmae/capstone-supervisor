import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth.service';
import { GeneralService } from '../services/general.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  mobileQuery: MediaQueryList;
  user: any
  private dateTimeInterval: any;

  constructor(
    private as: AuthService,
    private us: UserService,
    private gs: GeneralService, 
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,  
    private media: MediaMatcher,
  ) {
    this.mobileQuery = this.media.matchMedia('(max-width: 680px)');
    this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }
  
  @ViewChild('sidenav') sidenav!: MatSidenav; // Use @ViewChild to get #sidenav
  private _mobileQueryListener: () => void;


  ngOnInit(): void {
    this.user = this.us.getUser()

    let supervisor = this.user.industry_partner.immediate_supervisor
    let supervisorFullName = `${supervisor?.first_name || ''} ${supervisor?.last_name || ''} ${supervisor?.ext_name || ''}`.trim();
    this.user.industry_partner.immediate_supervisor.full_name = supervisorFullName;
    
    console.log(this.user)
    this.updateDateTime();
    this.dateTimeInterval = setInterval(() => this.updateDateTime(), 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.dateTimeInterval);
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  currentScrollLevel: number = 0
  hideHeader: boolean = false

  @ViewChild('bodyContent', { static: true }) bodyContent!: ElementRef;

  onScroll(event: any) {
    const scrollTop = event.target.scrollTop;

    if(scrollTop <= 50) {
      this.currentScrollLevel = scrollTop
      this.hideHeader = false
      return
    }

    if (Math.abs(this.currentScrollLevel - scrollTop) >= 70) {
      this.hideHeader = this.currentScrollLevel < scrollTop;
      this.currentScrollLevel = scrollTop;
    }
  }

  logout() {
    Swal.fire({
      icon: 'warning',
      title: "Logout?",
      text: 'You will be exiting the application',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: "Logout",
    }).then((result) => {
      if (result.isConfirmed) {
        this.as.logout().subscribe(
          response => {
            this.gs.successToastAlert('You have been logged out.')
            this.router.navigate(['/login'])
          },
          error => {
            sessionStorage.clear()
            this.router.navigate(['/login'])
          }
        )
      } 
    });
  }

   // Correctly declare updateDateTime as a method
   updateDateTime(): void {
    const dateTimeElement = document.getElementById("dateTime");
    if (dateTimeElement) { // Check if dateTimeElement is not null
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long' as const, 
        month: 'short' as const, 
        day: 'numeric' as const, 
        year: 'numeric' as const, 
        hour: '2-digit' as const, 
        minute: '2-digit' as const 
      };
      dateTimeElement.textContent = now.toLocaleDateString('en-US', options);
    }
  }
}
