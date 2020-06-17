import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderService } from './common/services/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading = this.loaderServce.isHttpServiceLoading;
  constructor(public router: Router, private loaderServce: LoaderService) { }
  title = 'vidyavahini';
}
