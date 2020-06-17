import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MentorRegistrationComponent } from './mentor-registration.component';

const routes: Routes = [{ path: '', component: MentorRegistrationComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MentorRegistrationRoutingModule { }
