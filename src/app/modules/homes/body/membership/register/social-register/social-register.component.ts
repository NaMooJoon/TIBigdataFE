import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../../../../../communications/fe-backend-db/membership/auth-google.service';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

class userProfile {
  nickName: String;
  name: String;
  status: String;
  inst: String;
  email: String;
  password: String;
  api: Boolean;
}

@Component({
  selector: 'app-social-register',
  templateUrl: './social-register.component.html',
  styleUrls: ['./social-register.component.less']
})

export class SocialRegisterComponent implements OnInit {
  private registerForm: FormGroup;
  private statusList: any = ['대학생', '석사', '박사', '연구원', '기타'];
  private registerProfile = new userProfile;
  constructor(private gAuth: AuthGoogleService, private _router: Router, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      nickName: new FormControl('', [
        Validators.required,
      ]),
      status: new FormControl('', [
        Validators.required,
      ]),
      inst: new FormControl('', [
        Validators.required,
      ]),
    })
  }

  gRegister(): void {
    // TODO: update database with gmail info + info from form(nickname, inst, status)
    this.gAuth.googleSignIn().then((user) => {
      this.registerProfile.name = user.name;
      this.registerProfile.email = user.email;
      this.registerProfile.api = false;
      this.registerProfile.inst = this.registerForm.get('inst').value;
      this.registerProfile.status = this.registerForm.get('status').value;
      this.registerProfile.nickName = this.registerForm.get('nickName').value;

      let regResult = this.gAuth.register(this.registerProfile);

      if (regResult) {
        this._router.navigate(['/register-ok'], { queryParams: { email: this.registerProfile.email } });
      }
      else {
        alert("오류가 발생했습니다. 다시 회원가입을 시도해주세요");
        this.ngOnInit();
      }
    })


  }

}
