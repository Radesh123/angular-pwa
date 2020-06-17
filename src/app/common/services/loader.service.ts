import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  constructor() { }
  isHttpServiceLoading = new Subject<boolean>();

  showLoader() {
    this.isHttpServiceLoading.next(true);
  }

  hideLoader() {
    this.isHttpServiceLoading.next(false);
  }
}
