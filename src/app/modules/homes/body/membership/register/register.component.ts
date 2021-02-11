import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from '@angular/material/icon';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from 'src/app/modules/communications/fe-backend-db/membership/auth.service';
import { UserProfile } from 'src/app/modules/communications/fe-backend-db/membership/user.model';
import { NavComponent } from '../../../nav/nav.component';
import { navMenu, NavService } from '../../../nav/nav.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})

export class RegisterComponent implements OnInit {
  private registerForm: FormGroup;
  private statusList: Array<string> = ['대학생', '석사', '박사', '연구원', '기타'];
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private navService: NavService,
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      status: new FormControl('', [
        Validators.required,
      ]),
      inst: new FormControl('', [
        Validators.required,
      ]),
    });
    this.navService.setNavMenu(navMenu.REGISTER);
  }

  async registerUser(): Promise<void> {
    let userData: UserProfile = new UserProfile();
    userData.inst = this.registerForm.get('inst').value;
    userData.status = this.registerForm.get('status').value;
    let result = await this.authService.register(userData);

    console.log(result);
    if (result) {
      window.alert('회원가입이 완료되었습니다.');
      this.router.navigateByUrl('/register-ok');
    }
    else {
      window.alert('이미 가입된 회원입니다. 로그인해주세요.');
      this.router.navigateByUrl('/login')
    }
  }
}