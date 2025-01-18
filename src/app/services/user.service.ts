import { Injectable } from '@angular/core';
import { Inject,  PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { GeneralService } from './general.service';

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
    studentEvaluation: string = 'studentEvalutation'

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private gs: GeneralService
    ) {}

    setUser(user: User) {
        let encryptedData = this.gs.encrypt(user)
        sessionStorage.setItem('user', encryptedData)
    }

    getUser() {
        let user = sessionStorage.getItem('user')

        if(!user) {
            return null
        }

        let plainTextData = this.gs.decrypt(user)

        return plainTextData
    }

    setStudentProfile(data: any) {
        let encryptedData = this.gs.encrypt(data)
        sessionStorage.setItem(this.studentProfile, encryptedData)
    }

    getStudentProfile() {
        let studentProfile = sessionStorage.getItem(this.studentProfile)

        if(!studentProfile) {
            return null
        }
        
        let plainTextData = this.gs.decrypt(studentProfile)

        return plainTextData
    }

    setStudentEvaluation(data: any) {
        let encryptedData = this.gs.encrypt(data)
        sessionStorage.setItem(this.studentEvaluation, encryptedData)
    }

    getStudentEvaluation() {
        let studentEvaluation = sessionStorage.getItem(this.studentEvaluation)

        if(!studentEvaluation) {
            return null
        }

        let plainTextData = this.gs.decrypt(studentEvaluation)

        return plainTextData
    }

    setStudentApplication(data: any) {
        let encryptedData = this.gs.encrypt(data)
        sessionStorage.setItem(this.studentApplication, encryptedData)
    }

    getStudentApplication() {
        let studentApplication = sessionStorage.getItem(this.studentApplication)

        if(!studentApplication) {
            return null
        }

        let plainTextData = this.gs.decrypt(studentApplication)

        return plainTextData
    }
}
