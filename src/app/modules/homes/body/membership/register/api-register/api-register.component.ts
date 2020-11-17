import { Component, OnInit, ɵsetCurrentInjector } from '@angular/core';
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

  async ngOnInit() {
    await this._auth.verifySignIn();
    if (this._auth.getApiStat()) {
      alert("이미 API 사용이 승인된 계정입니다.");
      this._router.navigateByUrl("/homes");
    }

    this._userAuthType = this._auth.getAuthType();
  }

  async registerApi() {
    await this._auth.apiRegister();
  }
}
