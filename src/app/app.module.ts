import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './common/components/login/login.component';
import { HeaderComponent } from './common/components/header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LandingscreenComponent } from './common/components/landingscreen/landingscreen.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { EmailVerificationComponent } from './common/components/email-verification/email-verification.component';
import { RestInterceptorService } from './common/services/rest-interceptor.service';
import { WelcomeComponent } from './common/components/welcome/welcome.component';
import { ForgotPasswordComponent } from './common/components/forgot-password/forgot-password.component';
import { MentorapprovalComponent } from './coordinator/mentorapproval/mentorapproval.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    LandingscreenComponent,
    EmailVerificationComponent,
    WelcomeComponent,
    ForgotPasswordComponent,
    MentorapprovalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    {provide: HTTP_INTERCEPTORS , useClass: RestInterceptorService, multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
