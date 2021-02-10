import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  async signIn() {
    let isSuccess = await this.authService.signIn();
    if (isSuccess) {
      window.alert('환영합니다 :)');
      this.router.navigateByUrl('/');
    }
    else {
      window.alert('가입되지 않은 회원입니다. 가입 후 이용해주세요 :)');
      this.router.navigateByUrl("/register");
    }
  }
}
