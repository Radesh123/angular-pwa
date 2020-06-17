import { Component, OnInit } from '@angular/core';
import { RestService } from '../../common/services/rest.service';

@Component({
  selector: 'app-mentorapproval',
  templateUrl: './mentorapproval.component.html',
  styleUrls: ['./mentorapproval.component.scss']
})
export class MentorapprovalComponent implements OnInit {
  mentorData = [];
  currentStep = 1;
  mentorProfile: any;
  mentorName: string;
  mentorId: string;
  stepText = 'Mentor Registration Action';
  constructor(private rest: RestService) { }
  
  ngOnInit() {
    this.getMentors();
  }
  viewDetails(mentorId: string, name: string) {
    this.rest.get('mentor/'+mentorId).subscribe(response => { 
      if (response['success']) {
        console.log('response... ', response);
        this.currentStep++;
        this.stepText = 'Mentor Profile';
        this.mentorProfile = response['body'];
        this.mentorName = name;
        this.mentorId = mentorId;
      }
    });
  }
  prevSection() {
    this.getMentors();
    this.currentStep--;
    this.stepText = 'Mentor Registration Action';
  }
  approveMentor(status: string) {
    let reqData = {UserId: this.mentorId};
    if (status === 'approve') {
      this.rest.post('mentor/activate', reqData).subscribe(response => { 
        if (response['success']) {
          console.log('response ', response);
          alert('Mentor profile has been approved successfully.');
        }
      });
    } else {
      //disapprove service call
    }
  }
  getMentors() {
    this.rest.get('mentor').subscribe(response => { 
      if (response['success']) {
        console.log('response ', response);
        this.mentorData = response['body']['mentors'];
      }
    });
  }

}
