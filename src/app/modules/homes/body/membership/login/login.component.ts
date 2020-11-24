import { Component, OnInit } from '@angular/core';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { AuthEmailService } from '../../../../communications/fe-backend-db/membership/auth-email.service';
import { AuthGoogleService } from '../../../../communications/fe-backend-db/membership/auth-google.service';
import { Router } from '@angular/router'
import { AuthService, SocialUser, GoogleLoginProvider } from 'angularx-social-login';
import { thresholdSturges } from 'd3-array';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [AuthService]
})
export class LoginComponent implements OnInit {
  constructor(private auth: EPAuthService, private _router: Router, private _gauth: AuthService, private gAuth: AuthGoogleService, private eAuth: AuthEmailService) { }
  private loginUserData = undefined;

  ngOnInit() {
    this.loginUserData = {};
  }

  eLogIn() {
    this.eAuth.logIn(this.loginUserData)
  }

  gLogIn(): void {
    this.gAuth.logIn();
  }

  toRegister() {
    this._router.navigateByUrl("/membership/register");
  }

}
