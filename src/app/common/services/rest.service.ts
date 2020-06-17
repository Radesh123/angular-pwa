import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private http: HttpClient) { }
  post(serviceName, body) {
    const api = environment.apiPath;
    const serviceUrl = this.getServiceUrl(api, serviceName);
    return this.http.post(serviceUrl, body);
  }
  get(serviceName) {
    const api = environment.apiPath;
    const serviceUrl = this.getServiceUrl(api, serviceName);
    return this.http.get(serviceUrl).pipe(map(result => result));
  }
  getServiceUrl(controllerPath, serviceName) {
    return controllerPath + serviceName;
  }
  getDomainUrl() {
    return environment[window.location.origin].domainUrl;
  }
}
