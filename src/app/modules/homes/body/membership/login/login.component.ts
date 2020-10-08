import { Component, OnInit } from '@angular/core';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { AuthEmailService } from '../../../../communications/fe-backend-db/membership/auth-email.service';
import { AuthGoogleService } from '../../../../communications/fe-backend-db/membership/auth-google.service';
import { Router } from '@angular/router'
import { AuthService, SocialUser,GoogleLoginProvider} from 'angularx-social-login';
import { thresholdSturges } from 'd3-array';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers:[AuthService]
})
export class LoginComponent implements OnInit {
  constructor(private auth: EPAuthService, private _router: Router, private _gauth: AuthService, private gAuth : AuthGoogleService, private eAuth : AuthEmailService) { }
  private loginUserData = undefined;
  
  // private user: SocialUser; 

  // private nowUser : String;
  // private isLogin : boolean = false;

  ngOnInit() {
    this.loginUserData = {};
  }

  // login with email
  eLogIn() {
    this.eAuth.logIn(this.loginUserData)
    // this._router.navigate(['/homes'])
    // .subscribe((res) => {
    //   //nickname should be added to identify user using the applicatoin.
    //   localStorage.setItem('token', res.token);
    //   this._router.navigate(['/homes/library'])
    // })
  }



  //login with google
  gLogIn():void{ 
    this.gAuth.logIn();
  }


  //where do we use this?
  // signInWithGoogle(): void { 
  //   this._gauth.signIn(GoogleLoginProvider.PROVIDER_ID);
  // }

  //register page
  toRegister(){
    this._router.navigateByUrl("/membership/register");
  }

}
