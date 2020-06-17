import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { RestService } from '../../common/services/rest.service';
import { TeacherRegReq } from '../../common/interfaces/api-request-model/api-request.model';

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

@Component({
  selector: 'app-teacher-registration',
  templateUrl: './teacher-registration.component.html',
  styleUrls: ['./teacher-registration.component.scss']
})
export class TeacherRegistrationComponent implements OnInit {
  regInfoType = 'Profile Details';
  currentStep = 1;
  progressBarInfo = [];
  btnText = 'NEXT';
  nextClicked = false;
  verifyClicked = false;
  emailVerifyMsg = '';
  emailVerifyStatus = false;
  registrationStatus = '';
  registrationForm: FormGroup;
  statesList = [];
  regMetaData:any;

  constructor(private router: Router, private fb: FormBuilder, private rest: RestService) { }

  ngOnInit() {
    this.progressBarInfo = [{ id: 1, desc: 'Profile Details' },
    { id: 2, desc: 'Professional Details' },
    { id: 3, desc: 'Password Setup' }];
    this.registrationForm = this.fb.group({
      userId: ['', Validators.required],
      'profileDetails': this.fb.group({
        schoolName: [{value: '', disabled: true}, Validators.required],
        name: [{value: '', disabled: true}, Validators.required],
        teacherId: ['', Validators.required],
        contactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required]
      }),
      'professionalDetails': this.fb.group({
        qualification: ['', Validators.required],
        languages: this.fb.array([this.fb.group({language: ['', Validators.required]})]),
        subjects: this.fb.array([this.fb.group({subject: ['', Validators.required]})]),
        classes: this.fb.array([this.fb.group({class: ['', Validators.required]})])
      }),
      'passwordDetails': this.fb.group({
        password: ['', [Validators.required, Validators.minLength(8), startsWithCaps, oneNumberSpecialChar]],
        confirmPassword: ['', Validators.required]
      },{validator: this.checkPasswords })
    });
    let profControl = <FormGroup>this.registrationForm.get('professionalDetails');
    profControl.get('qualification').valueChanges.subscribe((val) => {
      if (val === 'other') {
        profControl.addControl('OtherQualification', this.fb.control('', Validators.required));
      } else {
        profControl.removeControl('OtherQualification');
      }
    })
    if (!localStorage.getItem('regMetaData')) {
      this.getRegMetaData();
    } else {
      this.regMetaData = JSON.parse(localStorage.getItem('regMetaData'));
    }
  }

  getRegMetaData() {
    this.rest.get('registration').subscribe(data => {
      console.log(data);
      if (data['success']) {
        localStorage.setItem('regMetaData', JSON.stringify(data['body']));
        this.regMetaData = data['body'];
      }
    });
  }

  checkPasswords(group: FormGroup) {
    return group.get('password').value === group.get('confirmPassword').value ? null : { notSame: true }; 
  }

  get languages() {
    return this.registrationForm.get('professionalDetails').get('languages') as FormArray;
  }

  get subjects() {
    return this.registrationForm.get('professionalDetails').get('subjects') as FormArray;
  }

  get classes() {
    return this.registrationForm.get('professionalDetails').get('classes') as FormArray;
  }

  addMoreItems(fGrpName: string, fCtrlName: string) {
    this[fGrpName].push(this.fb.group({[fCtrlName]: ['', Validators.required]}));
  }

  removeItem(type: string, index: number): void {
    (<FormArray>this.registrationForm.get('professionalDetails').get(type)).removeAt(index);
  }

  updateStepInfo() {
    this.nextClicked = true;
    if (this.validateForm()) {
      this.nextClicked = false;
      if (this.currentStep === 3) {
        const request = this.prepareTeacherRegReq();
        console.log(request);
        this.rest.post('teacher', request).subscribe(response => {
          if (response['success']) {
            this.registrationStatus = 'success';
          }
          console.log('response ', response);
        })
        return;
      }
      this.currentStep++
      this.changeStepDesc();
    }
  }

  prevSection() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
    this.changeStepDesc();
  }

  changeStepDesc() {
    if (this.currentStep === 3) {
      this.btnText = 'REGISTER';
    } else {
      this.btnText = 'NEXT';
    }
    this.progressBarInfo.some((step) => {
      if (step.id === this.currentStep) {
        this.regInfoType = step.desc;
        return true;
      }
      return false;
    })
  }

  validateForm() {
    let formValid = false;
    window.scrollTo(0, 0);
    if (this.currentStep === 1) {
      formValid = this.registrationForm.get('profileDetails').valid;
    } else if (this.currentStep === 2) {
      formValid = this.registrationForm.get('professionalDetails').valid;
    } else if (this.currentStep === 3) {
      formValid = this.registrationForm.valid;
    }
    return formValid;
    //return true;
  }

  verifyEmail() {
    this.verifyClicked = true;
    console.log(this.registrationForm.get('profileDetails').get('email'));
    const email = this.registrationForm.get('profileDetails').get('email').value;
    if (this.registrationForm.get('profileDetails').get('email').valid) {
      //saim513@yopmail.com
      this.rest.get(`teacher/${email}`).subscribe(data => {
        console.log('data ', data);
        if (data['success']) {
          this.emailVerifyStatus = true;
          this.emailVerifyMsg = '';
          const teacherData = {
            userId: data['body'].userId,
            profileDetails: {
              name: data['body']['teacher'].name,
              teacherId:  data['body']['teacher'].id,
              schoolName: data['body']['school'].name
            }
          };
          this.registrationForm.patchValue(teacherData);
        } else {
          this.emailVerifyMsg = 'Email verification failed. Please contact administrator.';
          this.emailVerifyStatus = false;
        }
      }, error => {
        console.log('error', error);
        this.emailVerifyMsg = 'Email verification failed. Please contact administrator.';
        this.emailVerifyStatus = false;
      });
    }
  }

  prepareTeacherRegReq() {
    let reqData = <TeacherRegReq>{};
    const formData = this.registrationForm.getRawValue();
    reqData.UserId = formData.userId;
    reqData.TeacherId = formData.profileDetails.teacherId;
    reqData.Email = formData.profileDetails.email;
    reqData.Name = formData.profileDetails.name;
    reqData.ContactNumber = formData.profileDetails.contactNumber;
    reqData.GenderId = parseInt(formData.profileDetails.gender);
    reqData.City = formData.profileDetails.city;
    reqData.StateId = parseInt(formData.profileDetails.state);
    reqData.QualificationId = parseInt(formData.professionalDetails.qualification);
    reqData.OtherQualification = formData.professionalDetails.OtherQualification;
    reqData.Languages = formData.professionalDetails.languages.map(language => parseInt(language.language));
    reqData.Subjects = formData.professionalDetails.subjects.map(subject => parseInt(subject.subject));
    reqData.Classes = formData.professionalDetails.classes.map(clss => parseInt(clss.class));
    reqData.Password = formData.passwordDetails.password;

    return reqData;
  }

}
