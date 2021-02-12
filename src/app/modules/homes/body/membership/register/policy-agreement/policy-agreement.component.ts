import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SocialAuthService } from 'angularx-social-login';
import { AuthService } from 'src/app/modules/communications/fe-backend-db/membership/auth.service';

@Component({
  selector: 'app-policy-agreement',
  templateUrl: './policy-agreement.component.html',
  styleUrls: ['./policy-agreement.component.css']
})
export class PolicyAgreementComponent implements OnInit {
  private _userAuthType = null;
  private isLogIn: Boolean;


  constructor(
    private _auth: AuthService,
    private _gauth: SocialAuthService,
    private _router: Router,
  ) { }

  async ngOnInit() {
  }

  async registerApi(): Promise<void> {
    await this._auth.apiRegister();
  }
}