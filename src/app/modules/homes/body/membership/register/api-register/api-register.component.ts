import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'angularx-social-login';
import { EPAuthService } from 'src/app/modules/communications/fe-backend-db/membership/auth.service';
import { logStat, UserProfile } from 'src/app/modules/communications/fe-backend-db/membership/user.model';

@Component({
  selector: 'app-api-register',
  templateUrl: './api-register.component.html',
  styleUrls: ['./api-register.component.less']
})
export class ApiRegisterComponent implements OnInit {
  private _userAuthType = null;

  constructor(
    private _auth: EPAuthService,
    private _gauth: AuthService,
    private _router: Router,
  ) { }

  ngOnInit() {
    console.log(this._auth.getLogInStat());
  }
}
