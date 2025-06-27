import { Injectable } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { appSettings } from '../../environments/environment';
import { GeneralService } from './general.service';
import * as CryptoJS from 'crypto-js';

interface User {
  name: string;
  program: string;
  picture: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user: string = 'user';
  private token: string = btoa('token');
  private studentProfile: string = 'studentProfile';
  private studentApplication: string = 'studentApplication';
  private studentEvaluation: string = 'studentEvaluation';
  private technicalSkills: string = btoa('technicalSkills');
  private selectedAcademicYear: string = btoa('selectedAcademicYears');

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private gs: GeneralService
  ) {}

  private genRanHex(size: number): string {
    return Array.from({ length: size }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  }

  private setData(label: string, data: any) {
    sessionStorage.setItem(label, this.encrypt(data));
  }

  private extractData(label: string) {
    return this.decrypt(sessionStorage.getItem(label));
  }

  setUserLogState() {
    sessionStorage.setItem('userLogState', 'true');
  }

  setToken(data: any) {
    this.setData(this.token, data);
  }
  getToken() {
    return this.extractData(this.token);
  }

  setUser(data: any) {
    this.setData(this.user, data);
  }
  getUser() {
    return this.extractData(this.user);
  }

  setStudentProfile(data: any) {
    this.setData(this.studentProfile, data);
  }
  getStudentProfile() {
    return this.extractData(this.studentProfile);
  }

  setStudentEvaluation(data: any) {
    this.setData(this.studentEvaluation, data);
  }
  getStudentEvaluation() {
    return this.extractData(this.studentEvaluation);
  }

  setStudentApplication(data: any) {
    this.setData(this.studentApplication, data);
  }
  getStudentApplication() {
    return this.extractData(this.studentApplication);
  }

  setTechnicalSkillsData(data: any) {
    this.setData(this.technicalSkills, data);
  }
  getTechnicalSkillsData() {
    return this.extractData(this.technicalSkills);
  }

  setSelectedAcademicYears(data: any) {
    this.setData(this.selectedAcademicYear, data);
  }
  getSelectedAcademicYears() {
    return this.extractData(this.selectedAcademicYear);
  }

  encrypt(data: any): string {
    const note = appSettings.frontNote;

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), note).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      return '';
    }
  }

  decrypt(cipherText: string | null): any {
    const note = appSettings.frontNote;

    if (!cipherText) {
      return null;
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
    const decodedData = JSON.parse(
      CryptoJS.enc.Base64.parse(data).toString(CryptoJS.enc.Utf8)
    );

    const key = appSettings.note;
    const iv = CryptoJS.enc.Base64.parse(decodedData.iv);
    const salt = CryptoJS.enc.Base64.parse(decodedData.salt);
    const iterations = CryptoJS.enc.Base64.parse(
      decodedData.iterations
    ).toString(CryptoJS.enc.Utf8);
    const ciphertext = decodedData.encryptedValue;

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
    return JSON.parse(data);
  }

  encryptPayload(data: object): string {
    const stringData = JSON.stringify(data);

    const key = CryptoJS.enc.Hex.parse(this.genRanHex(64));
    const iv = CryptoJS.enc.Hex.parse(this.genRanHex(32));

    const encrypted = CryptoJS.AES.encrypt(stringData, key, {
      iv: iv,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC,
    });

    const prefix = this.genRanHex(12);

    const payload =
      prefix +
      iv.toString(CryptoJS.enc.Hex) +
      key.toString(CryptoJS.enc.Hex) +
      encrypted.ciphertext.toString(CryptoJS.enc.Hex);

    return btoa(payload);
  }
}
