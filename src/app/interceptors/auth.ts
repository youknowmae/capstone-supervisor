import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';

import { GeneralService } from '../services/general.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private gs: GeneralService
    ) {}
  
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        let token = sessionStorage.getItem(btoa('token'))
        
        if(!token){
            return next.handle(request);
        }

        token = this.gs.decrypt(token)
    
        const authReq = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
    
        return next.handle(authReq);
    }
  }