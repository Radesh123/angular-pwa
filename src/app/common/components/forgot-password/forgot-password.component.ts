import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../services/rest.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordForm: FormGroup;
  nextClicked = false;
  hide = true;
  errorMessage;
  resetSuccess;
  username;
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private restService: RestService, private router: Router) { }

  ngOnInit() {
    this.validateToken();
    this.forgotPasswordForm = this.fb.group({
      password: this.fb.control('', [Validators.required, Validators.minLength(8), startsWithCaps, oneNumberSpecialChar]),
      confirmPassword: this.fb.control('', [Validators.required])
    }, {validator: this.checkPasswords });
  }
  toggleEyeIcon() {
    this.hide = !this.hide;
  }
  validateToken() {
    this.route.params.subscribe(params => {
      const token = {'token' : params.tokenId};
      this.restService.post('account/validatetoken', token).subscribe((response) => {
        console.log(response);
        this.username = response['body'].username;
      }, (error) => {
        this.errorMessage = error;
      });
    });
  }
  checkPasswords(group: FormGroup) {
    return group.get('password').value === group.get('confirmPassword').value ? null : { notSame: true };
  }
  resetPassword() {
    const body = {
      'username': this.username,
      'password': this.forgotPasswordForm.value.password
    };
    this.restService.post('account/changepassword', body).subscribe((response) => {
      this.resetSuccess = response['success'];
      this.forgotPasswordForm.reset();
    }, (error) => {
      this.errorMessage = error;
    });
  }
}

export function startsWithCaps(password: FormControl) {
  let startsCapsRegex = /[A-Z]/;
  return startsCapsRegex.test(password.value) ? null : {
    caps: {
      valid: false
    }
  };
}

export function oneNumberSpecialChar(password: FormControl) {
  let numberSpecialRegex = /^(?=.*\d)(?=.*[@$!%*#?&])/;
  return numberSpecialRegex.test(password.value) ? null : {
    numberSpecial: {
      valid: false
    }
  };
}
