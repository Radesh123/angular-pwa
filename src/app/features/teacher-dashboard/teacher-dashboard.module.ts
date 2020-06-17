import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeacherDashboardComponent } from './teacher-dashboard.component';

import { TeacherRegistrationRouting } from './teacher-dashboard-routing.module';



@NgModule({
  declarations: [TeacherDashboardComponent],
  imports: [
    CommonModule,
    TeacherRegistrationRouting
  ]
})
export class TeacherDashboardModule { }
