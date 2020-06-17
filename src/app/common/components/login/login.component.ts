import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RestService } from '../../services/rest.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  nextClicked = false;
  loginResponse;
  errorMessage;
  hide = true;
  passwordReset = false;
  constructor(private fb: FormBuilder, private restService: RestService, private router: Router) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: this.fb.control('', [Validators.required, Validators.email]),
      password: this.fb.control('', Validators.required)
    });
  }


  toggleEyeIcon() {
    this.hide = !this.hide;
  }
  triggerForgotPassword(emailValue) {
    if (emailValue) {
      const body = {
        'username': emailValue
      };
      this.restService.post('account/forgotpassword', body).subscribe((response) => {
        this.passwordReset = response['success'];
        this.loginForm.reset();
      }, (error) => {
        this.errorMessage = error;
      });
    }
  }

  loginUser() {
    this.errorMessage = '';
    this.nextClicked = true;
    const loginDetails = this.prepareLoginRequest();
    if (this.loginForm.valid) {
      this.restService.post('account/login', loginDetails).subscribe((response) => {
        console.log(response);
        localStorage.setItem('userDetails', response['body']['name']);
        if (response['body']['userRoles'] && response['body']['userRoles'].length > 0 ) {
          if (response['body']['userRoles'][0]['name'] === 'Teacher') {
            this.router.navigate(['teacher-dashboard']);
          } else if (response['body']['userRoles'][0]['name'] === 'Administrator') {
            this.router.navigate(['mentorapproval']);
          }
        }
      }, (error) => {
        this.errorMessage = error;
        console.log(this.errorMessage);
      });
    }
  }
  prepareLoginRequest() {
    const request = {
      'Username': this.loginForm.value.email,
      'Password': this.loginForm.value.password
    };
    return request;
  }

}
