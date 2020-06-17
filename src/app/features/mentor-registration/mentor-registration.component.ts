import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { RestService } from '../../common/services/rest.service';
import { MentorRegReq } from '../../common/interfaces/api-request-model/api-request.model';


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
  selector: 'app-mentor-registration',
  templateUrl: './mentor-registration.component.html',
  styleUrls: ['./mentor-registration.component.scss']
})
export class MentorRegistrationComponent implements OnInit {

  regInfoType = 'Profile Details';
  currentStep = 1;
  progressBarInfo = [];
  btnText = 'NEXT';
  nextClicked = false;
  emailVerifyMsg = '';
  registrationStatus = '';
  registrationForm: FormGroup;
  statesList = [];
  regMetaData:any;
  constructor(private fb: FormBuilder, private rest: RestService) { }

  ngOnInit() {
    this.progressBarInfo = [{ id: 1, desc: 'Profile Details' },
    { id: 2, desc: 'Professional Details' },
    { id: 3, desc: 'Password Setup' }];
    this.registrationForm = this.fb.group({
      'profileDetails': this.fb.group({
        name: ['', Validators.required],
        contactNumber: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
        email: ['', [Validators.required, Validators.email]],
        gender: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required]
      }),
      'professionalDetails': this.fb.group({
        languages: this.fb.array([this.fb.group({language: ['', Validators.required]})]),
        worksInSSSVV: ['', Validators.required],
        worksInSaiOrg: ['', Validators.required],
        qualification: ['', Validators.required],
        expInEng: ['', Validators.required],
        occupation: ['', Validators.required],
        weeklyHours: ['', Validators.required],
        managebleTeachers: ['', Validators.required]
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
    });
    profControl.get('worksInSSSVV').valueChanges.subscribe((val) => {
      if (val === 'Yes') {
        profControl.addControl('volunteerName', this.fb.control('', Validators.required));
      } else {
        profControl.removeControl('volunteerName');
      }
    });
    profControl.get('worksInSaiOrg').valueChanges.subscribe((val) => {
      if (val === 'Yes') {
        profControl.addControl('sssvvVolunteer', this.fb.control('', Validators.required));
      } else {
        profControl.removeControl('sssvvVolunteer');
      }
    });
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
        this.rest.post('mentor', request).subscribe(response => {
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

  prepareTeacherRegReq() {
     let reqData = <MentorRegReq>{};
     const formData = this.registrationForm.getRawValue();
     reqData.Name = formData.profileDetails.name;
     reqData.Email = formData.profileDetails.email;
     reqData.Password = formData.passwordDetails.password;
     reqData.GenderId = parseInt(formData.profileDetails.gender);
     reqData.ContactNumber = formData.profileDetails.contactNumber;
     reqData.City = formData.profileDetails.city;
     reqData.StateId = parseInt(formData.profileDetails.state);
     reqData.QualificationId = parseInt(formData.professionalDetails.qualification);
     reqData.OtherQualification = formData.professionalDetails.OtherQualification;
     reqData.Languages = formData.professionalDetails.languages.map(language => parseInt(language.language));
     reqData.WorkingInSssvv = formData.professionalDetails.worksInSSSVV === 'Yes' ? true: false;
     reqData.SssvvVolunteer = formData.professionalDetails.volunteerName;
     reqData.WorkingInSaiOrganization = formData.professionalDetails.worksInSaiOrg === 'Yes' ? true: false;
     reqData.SaiOrganizationVolunteer = formData.professionalDetails.sssvvVolunteer;
     reqData.PastExperience = formData.professionalDetails.expInEng;
     reqData.Occupation = formData.professionalDetails.occupation;
     reqData.TimeCapacity = parseInt(formData.professionalDetails.weeklyHours);
     reqData.TeacherCapacity = parseInt(formData.professionalDetails.managebleTeachers);

    return reqData;
  }

}
