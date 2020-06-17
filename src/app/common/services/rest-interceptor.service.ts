import { Injectable } from '@angular/core';
import { HttpHandler, HttpEvent, HttpRequest, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { finalize, catchError } from 'rxjs/operators';
import { LoaderService } from './loader.service';

@Injectable({
  providedIn: 'root'
})
export class RestInterceptorService implements HttpInterceptor {

  constructor(private loaderService: LoaderService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const self = this;
    self.loaderService.showLoader();
    return next.handle(req).pipe(
      finalize(() => {
        this.loaderService.hideLoader();
      }),
      catchError((error: HttpErrorResponse) => {
        self.loaderService.hideLoader();
        return throwError(error.message || 'server error.');
      })
    );
  }
}
