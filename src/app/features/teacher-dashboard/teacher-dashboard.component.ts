import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss']
})
export class TeacherDashboardComponent implements OnInit {

  constructor() { }
  userDetails: any;

  ngOnInit() {
    this.userDetails = localStorage.getItem('userDetails');
    console.log(this.userDetails);
  }

}
