import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appSettings } from '../../environments/environment';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  apiUrl = appSettings.apiUrl;

  constructor(private http: HttpClient, private us: UserService) {}

  public get(endpoint: string, params: string | number = '') {
    return this.http.get<any>(this.apiUrl + endpoint + params);
  }

  public post(endpoint: string, params: string | number, payload: any) {
    return this.http.post<any>(
      this.apiUrl + endpoint + params,
      this.processPayload(payload)
    );
  }

  public delete(endpoint: string, params: string | number) {
    return this.http.delete<any>(this.apiUrl + endpoint + params);
  }

  public download(endpoint: string, params: string | number = '') {
    return this.http.get(this.apiUrl + endpoint + params, {
      responseType: 'blob',
    });
  }

  public fetchAssets(endpoint: string) {
    return this.http.get<any>('./assets/' + endpoint);
  }

  private processPayload(form: any) {
    if (form instanceof FormData) {
      const plain: any = {};
      const fileEntries: Record<string, File> = {};

      form.forEach((value, key) => {
        if (value instanceof File) {
          fileEntries[key] = value;
        } else {
          plain[key] = value;
        }
      });

      const encrypted = this.us.encryptPayload(plain);

      const finalForm = new FormData();
      finalForm.append('payload', encrypted);

      for (const key in fileEntries) {
        finalForm.append(key, fileEntries[key]);
      }

      return finalForm;
    } else {
      return { payload: this.us.encryptPayload(form) };
    }
  }
}
