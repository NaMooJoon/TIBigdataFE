import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, AuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';

//For Online video lecture
import {
  MatToolbarModule,
  MatFormFieldModule,
  MatInputModule,
  MatOptionModule,
  MatSelectModule,
  MatIconModule,
  MatButtonModule,
  MatCardModule,
  MatTableModule,
  MatDividerModule,
  MatSnackBarModule
} from '@angular/material';

import { CommunicationRoutingModule } from './communication-routing.module';
import { RegisterComponent } from '../homes/body/membership/register/register.component';
import { LoginComponent } from '../homes/body/membership/login/login.component';
import { EventService } from './fe-backend-db/membership/event.service';
import { AuthGuard } from './fe-backend-db/membership/auth.guard';
import { TokenInterceptorService } from './fe-backend-db/membership/token-interceptor.service';
import { SocialRegisterComponent } from '../homes/body/membership/register/social-register/social-register.component';
import { UserpageComponent } from '../homes/body/membership/userpage/userpage.component';
import { ControlComponent } from '../homes/body/membership/control/control.component';
import { RegisterOkComponent } from '../homes/body/membership/register/register-ok/register-ok.component';
import { ApiRegisterComponent } from '../homes/body/membership/register/api-register/api-register.component';
// import { QueryServiceComponent } fr
// om './fe-backend-db/query-service/query-service.component';

const PROVIDER_ID: string = "576807286455-35sjp2v8leqpfeg3qj7k2rfr3avns7a5.apps.googleusercontent.com"; //진범 localhost 승인

let config = new AuthServiceConfig([
  {
    id: GoogleLoginProvider.PROVIDER_ID,
    provider: new GoogleLoginProvider(PROVIDER_ID)
  }
]);

@NgModule({
  declarations: [
    RegisterComponent,
    RegisterOkComponent,
    ApiRegisterComponent,
    LoginComponent,
    // EventsComponent,
    SocialRegisterComponent,
    UserpageComponent,
    ControlComponent,
    // QueryServiceComponent
  ],
  imports: [
    FormsModule,
    CommonModule,
    HttpClientModule,
    CommunicationRoutingModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatDividerModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    SocialLoginModule.initialize(config)//refer angularx-sicial-login.umd.js
  ],
  providers: [
    EventService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },

    /**
     * need to use Google API client id
     * to communicate with backend server.
     * Register the client id into to angular Injector with provider.
     */
    {
      provide: "GOOGLE PROVIDER ID",
      useValue: PROVIDER_ID
    }
  ],
  // exports:[HeaderContainerComponent]
})
export class CommunicationModule { }
