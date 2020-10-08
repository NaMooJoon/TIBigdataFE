import { Component, OnInit } from '@angular/core';
import { AuthGoogleService } from '../../../../../communications/fe-backend-db/membership/auth-google.service';
import { Router } from "@angular/router";

@Component({
  selector: 'app-social-register',
  templateUrl: './social-register.component.html',
  styleUrls: ['./social-register.component.less']
})
export class SocialRegisterComponent implements OnInit {

  constructor(private gAuth: AuthGoogleService, private router : Router) { }

  private agrEmail: boolean = false;
  private agrAcs: boolean = false;
  private agrSrcHtr: boolean = false;

  ngOnInit() {
  }

  gRegister(platform: string): void {

    this.gAuth.googleSignIn().then((user) => {

      // gauth.signIn(platform).then((response) => {

      this.gAuth.register(user);
      // .subscribe((res) => {
      //   // if(res...is yes)
      //   //then
      //   console.log(res);
      //   alert(res.payload.user + "으로 회원가입 되었습니다. KUBiC 회원이 되신 것을 환영합니다. 다시 로그인해주세요.");
      //   this.router.navigate(['/homes']);

      // });

    })

    // })

  }

}
