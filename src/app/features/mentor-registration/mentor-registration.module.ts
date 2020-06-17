import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MentorRegistrationRoutingModule } from './mentor-registration-routing.module';
import { MentorRegistrationComponent } from './mentor-registration.component';
import { TeacherRegistrationModule } from '../teacher-registration/teacher-registration.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [MentorRegistrationComponent],
  imports: [
    CommonModule,
    MentorRegistrationRoutingModule,
    TeacherRegistrationModule,
    ReactiveFormsModule
  ]
})
export class MentorRegistrationModule { }
