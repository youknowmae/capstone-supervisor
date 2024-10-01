import { Injectable } from '@angular/core';
import { Inject,  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface User {
    name: string, 
    program: string, 
    picture: string
} 

@Injectable({
  providedIn: 'root'
})

export class UserService {
    studentProfile: string = 'studentProfile'
    studentApplication: string = 'studentApplication'
    // industryPartner: string = 'industryPartner'

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
    ) {}

    setUser(user: User) {
        sessionStorage.setItem('user', JSON.stringify(user))
    }

    getUser() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let user = sessionStorage.getItem('user')

        if(!user) {
            return null
        }

        return JSON.parse(user)
    }

    setStudentProfile(studentProfile: any) {
        sessionStorage.setItem(this.studentProfile, JSON.stringify(studentProfile))
    }

    getStudentProfile() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let studentProfile = sessionStorage.getItem(this.studentProfile)

        if(!studentProfile) {
            return null
        }

        return JSON.parse(studentProfile)
    }

    setStudentApplication(studentApplication: any) {
        sessionStorage.setItem(this.studentApplication, JSON.stringify(studentApplication))
    }

    getStudentApplication() {
        if (!isPlatformBrowser(this.platformId)){
            return null
        }
        
        let studentApplication = sessionStorage.getItem(this.studentApplication)

        if(!studentApplication) {
            return null
        }

        return JSON.parse(studentApplication)
    }


    // getIndustryPartner() {
    //     if (!isPlatformBrowser(this.platformId)){
    //         return null
    //     }
        
    //     let industryPartner = sessionStorage.getItem(this.industryPartner)

    //     if(!industryPartner) {
    //         return null
    //     }

    //     return JSON.parse(industryPartner)

    // }
}
