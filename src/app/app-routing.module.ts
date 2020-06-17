import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './common/components/login/login.component';
import { LandingscreenComponent } from './common/components/landingscreen/landingscreen.component';
import { EmailVerificationComponent } from './common/components/email-verification/email-verification.component';
import { WelcomeComponent } from './common/components/welcome/welcome.component';
import { ForgotPasswordComponent } from './common/components/forgot-password/forgot-password.component';
import { MentorapprovalComponent } from '../app/coordinator/mentorapproval/mentorapproval.component';

const routes: Routes = [
  {
    path: 'landing',
    component: LandingscreenComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  { path: 'teacher-reg', loadChildren: () =>
  import('./features/teacher-registration/teacher-registration.module').then(m => m.TeacherRegistrationModule) },
  { path: 'mentor-reg', loadChildren: () =>
  import('./features/mentor-registration/mentor-registration.module').then(m => m.MentorRegistrationModule) },
  { path: 'teacher-dashboard', loadChildren: () =>
  import('./features/teacher-dashboard/teacher-dashboard.module').then(m => m.TeacherDashboardModule) },
  {
    path: 'verifymail/:tokenId',
    component: EmailVerificationComponent
  },
  {
    path: 'resetpassword/:tokenId',
    component: ForgotPasswordComponent
  },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'mentorapproval', component: MentorapprovalComponent },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
