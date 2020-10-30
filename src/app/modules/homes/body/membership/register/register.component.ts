import { Component, OnInit } from '@angular/core';
import { AuthEmailService } from '../../../../communications/fe-backend-db/membership/auth-email.service';//register user service
import { Router } from '@angular/router'

class userProfile {
  nickName: String;
  name: String;
  position: String;
  inst: String;//institution
  email: String;
  password: String;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})

export class RegisterComponent implements OnInit {
  constructor(private eAuth: AuthEmailService, private _router: Router) { }

  registerUserData = new userProfile();
  private pw1 = "";
  private pw2 = "";

  ngOnInit() {
    this.initialize_data();
  }

  initialize_data() {
    this.pw1 = "";
    this.pw2 = "";
    this.registerUserData = new userProfile();
  }

  checkIfValid() {
    return this.pw1 == this.pw2;
  }

  async registerUser() {
    if (this.pw1 == this.pw2) //check for sure
      this.registerUserData.password = this.pw1;

    let regResult = await this.eAuth.register(this.registerUserData); //_auth : register user service

    if (regResult) {
      this._router.navigate(['/register-ok'], { queryParams: { email: this.registerUserData.email } });
    }
    else {
      window.location.reload();
    }
  }

  toSocReg() {
    this._router.navigateByUrl("/socReg");
  }

}
