import { Component, OnInit } from '@angular/core';
import { AuthEmailService } from '../../../../communications/fe-backend-db/membership/auth-email.service';//register user service
import { Router } from '@angular/router'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

class userProfile {
  nickName: String;
  name: String;
  status: String;
  inst: String;
  email: String;
  password: String;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})

export class RegisterComponent implements OnInit {

  private registerForm: FormGroup;
  private userProfile = new userProfile();
  private statusList: any = ['대학생', '석사', '박사', '연구원', '기타'];

  constructor(
    private eAuth: AuthEmailService,
    private _router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
      ]),
      nickName: new FormControl('', [
        Validators.required,
      ]),
      status: new FormControl('', [
        Validators.required,
      ]),
      inst: new FormControl('', [
        Validators.required,
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirm: new FormControl('', [
        Validators.required,
      ]),
    }, {
      validator: this.mustMatch('password', 'passwordConfirm'),
    });
  }

  onSubmit() {

    console.log(this.registerForm.get('name').value);
    this.userProfile.name = this.registerForm.get('name').value;
    this.userProfile.nickName = this.registerForm.get('nickName').value;
    this.userProfile.status = this.registerForm.get('status').value;
    this.userProfile.inst = this.registerForm.get('inst').value;
    this.userProfile.email = this.registerForm.get('email').value;
    this.userProfile.password = this.registerForm.get('password').value;



    this.registerUser();
  }

  async registerUser() {
    let regResult = await this.eAuth.register(this.userProfile); //_auth : register user service

    if (regResult) {
      this._router.navigate(['/register-ok'], { queryParams: { email: this.userProfile.email } });
    }
    else {
      window.location.reload();
    }
  }

  toSocReg() {
    this._router.navigateByUrl("/socReg");
  }

  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      }
      else {
        matchingControl.setErrors(null);
      }
    }
  }
}