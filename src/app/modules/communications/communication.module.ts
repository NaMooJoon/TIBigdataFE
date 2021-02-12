import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider } from 'angularx-social-login';
import { CommunicationRoutingModule } from './communication-routing.module';
import { RegisterComponent } from '../homes/body/membership/register/register.component';
import { LoginComponent } from '../homes/body/membership/login/login.component';
import { AuthGuard } from './fe-backend-db/membership/auth.guard';
import { ControlComponent } from '../homes/body/membership/control/control.component';
import { RegisterOkComponent } from '../homes/body/membership/register/register-ok/register-ok.component';
import { ApiRegisterComponent } from '../homes/body/membership/register/api-register/api-register.component';
import { ElasticSearchQueryModel } from './elasticsearch-service/elasticsearch.service.query.model';
import { CommunityPrivacyMaskingService } from '../homes/body/community/community-services/community-privacy-masking.service';

export const PROVIDER_ID: string = "576807286455-35sjp2v8leqpfeg3qj7k2rfr3avns7a5.apps.googleusercontent.com";

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterOkComponent,
    ApiRegisterComponent,
    LoginComponent,
    ControlComponent,
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    CommunicationRoutingModule,
    ReactiveFormsModule,
    SocialLoginModule,
  ],
  providers: [
    ElasticSearchQueryModel,
    CommunityPrivacyMaskingService,
    AuthGuard,

    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: true,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              PROVIDER_ID
            )
          },
        ]
      } as SocialAuthServiceConfig,
    }
  ],
})
export class CommunicationModule { }
