import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject, catchError, tap } from 'rxjs';
import { UserService } from './user.service';
import { GeneralService } from './general.service';
import { appSettings } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(
        private router: Router, 
        private http: HttpClient,
        private userService: UserService,
        private gs: GeneralService
    ) { }

    apiUrl = appSettings.apiUrl

    login(credentials: {email: string, password: string}) {

        return this.http.post<any>(`${this.apiUrl}login/supervisor`, credentials).pipe(
            tap((response => {
                console.log(response)
                if(response.token){
                    sessionStorage.setItem('userLogState', 'true')

                    let encryptedToken = this.gs.encrypt(response.token)
                    sessionStorage.setItem(btoa('token'), encryptedToken)


                    this.userService.setUser(response.user)

                    this.router.navigate(['/main'])
                }
            }))
        )
    }

    logout() {
        return this.http.get<any>(this.apiUrl + 'logout').pipe(
            tap((response => {
                sessionStorage.clear()
            }))
        )
    }

}