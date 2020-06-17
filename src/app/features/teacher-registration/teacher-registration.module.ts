import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TeacherRegistrationRouting } from './teacher-registration-routing.module';
import { TeacherRegistrationComponent } from './teacher-registration.component';
import { ProgressbarComponent } from '../../common/components/progressbar/progressbar.component';
import { RemoveItemPipe } from '../../common/pipes/remove-item.pipe';

@NgModule({
  declarations: [
    TeacherRegistrationComponent,
    ProgressbarComponent, 
    RemoveItemPipe],
  imports: [
    CommonModule,
    TeacherRegistrationRouting,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [ProgressbarComponent, RemoveItemPipe]
})
export class TeacherRegistrationModule { }
