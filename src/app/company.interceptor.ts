import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class CompanyInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // get information from authentication
    let guidEmpresa = "Eza77833NRWjchxTbFaoWYdipsLckzNOU5tUoNwartQ=";
    const companyReq = request.clone({
      setHeaders: {
        guidEmpresa
      },
    });

    return next.handle(companyReq);
  }
}
