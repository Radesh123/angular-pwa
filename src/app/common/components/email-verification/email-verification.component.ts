import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss']
})
export class EmailVerificationComponent implements OnInit {

  tokenId = '';
  verificationStatus = '';
  constructor(private route: ActivatedRoute, private router: Router, private rest: RestService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.tokenId = params['tokenId'];
      let url = 'account/activate/';
      if (this.tokenId && this.tokenId !== '') {
        url = url + this.tokenId;
      } else {
        this.verificationStatus = 'fail';
        return;
      }
      setTimeout(() => {
        this.rest.get(url).subscribe((response) => {
          this.verificationStatus = 'success';
        }, (error) => {
          this.verificationStatus = 'fail';
        });
      })
    })
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

}
