import { Injectable } from '@angular/core';
import { Inject,  PLATFORM_ID } from '@angular/core';
import { appSettings } from '../../environments/environment';
import { GeneralService } from './general.service';
import * as CryptoJS from 'crypto-js';

interface User {
    name: string, 
    program: string, 
    picture: string
} 

@Injectable({
  providedIn: 'root'
})

export class UserService {
    user: string = 'user'
    token: string = btoa('token')
    studentProfile: string = 'studentProfile'
    studentApplication: string = 'studentApplication'
    studentEvaluation: string = 'studentEvalutation'

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private gs: GeneralService
    ) {}

    private setData(label: string, data: any) {
        sessionStorage.setItem(label, this.encrypt(data))
    }

    private extractData(label: string){
        return this.decrypt(sessionStorage.getItem(label))
    }

    setUserLogState() { sessionStorage.setItem('userLogState', 'true') }

    setToken(data: any) { this.setData(this.token, data) }
    getToken() { return this.extractData(this.token) }
    
    setUser(data: any) { this.setData(this.user, data) }
    getUser() { return this.extractData(this.user) }


    setStudentProfile(data: any) { this.setData(this.studentProfile, data) }
    getStudentProfile() { return this.extractData(this.studentProfile) }

    setStudentEvaluation(data: any) { this.setData(this.studentEvaluation, data) }
    getStudentEvaluation() { return this.extractData(this.studentEvaluation) }

    setStudentApplication(data: any) { this.setData(this.studentApplication, data) }
    getStudentApplication() { return this.extractData(this.studentApplication) }
    
    encrypt(data: any): string {
        const note = appSettings.frontNote

        try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), note).toString();
        } catch (error) {
        console.error('Encryption error:', error);
        return '';
        }
    }

    decrypt(cipherText: string | null): any {
        const note = appSettings.frontNote

        if(!cipherText) {
        return null
        }

        try {
        const bytes = CryptoJS.AES.decrypt(cipherText, note);
        if (bytes.toString()) {
            return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        }
        return null;
        } catch (error) {
        console.error('Decryption error:', error);
        return null;
        }
    }

    recover(data: any) {
        const decodedData = JSON.parse(CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8));

        const key = appSettings.note
        const iv = CryptoJS.enc.Base64.parse(decodedData.iv)
        const salt = CryptoJS.enc.Base64.parse(decodedData.salt)
        const iterations = CryptoJS.enc.Base64.parse(decodedData.iterations).toString(CryptoJS.enc.Utf8)
        const ciphertext = decodedData.encryptedValue

        const hashKey = CryptoJS.PBKDF2(key, salt, {
            hasher: CryptoJS.algo.SHA256,
            keySize: 8,
            iterations: parseInt(iterations),
        });

        const bytes = CryptoJS.AES.decrypt(ciphertext, hashKey, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });

        data = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(data)
    }
}
