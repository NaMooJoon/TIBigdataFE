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
  private isLogIn: Boolean;


  constructor(
    private _auth: EPAuthService,
    private _gauth: AuthService,
    private _router: Router,
  ) { }

  async ngOnInit() {
    this.isLogIn = await this._auth.verifySignIn();
    if (this.isLogIn && this._auth.getApiStat()) {
      alert("이미 API 사용이 승인된 계정입니다.");
      this._router.navigateByUrl("/homes");
    }
    // else if (!this.isLogIn) {
    //   alert("로그인 세션이 만료되었습니다. 다시 로그인해주세요");
    //   this._router.navigateByUrl("/login");
    // }
  }

  async registerApi(): Promise<void> {
    await this._auth.apiRegister();
  }
}
