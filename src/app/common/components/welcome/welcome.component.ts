import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  userDetails: any;
  constructor() { }

  ngOnInit() {
    this.userDetails = localStorage.getItem('userDetails');
    console.log(this.userDetails);
  }

}
