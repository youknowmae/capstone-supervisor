import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { UserService } from './user.service';
import { appSettings } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
    constructor(
        private router: Router, 
        private http: HttpClient,
        private us: UserService
    ) { }

    apiUrl = appSettings.apiUrl

    login(credentials: {email: string, password: string}) {
        const payload = {
            payload: this.us.encryptPayload(credentials)
        }

        return this.http.post<any>(`${this.apiUrl}login/supervisor`, payload).pipe(
            tap((response => {
                console.log(response)
                if(response.token){
                    this.us.setUserLogState()
                    this.us.setToken(response.token)
                    this.us.setUser(response.user)
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