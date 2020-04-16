import { Component, OnInit, Output, EventEmitter, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { EPAuthService } from '../../core/componets/membership/auth.service';
// import { LoginComponent} from '../../core/componets/membership/login/login.component';
import { SocialUser, AuthService} from 'angular4-social-login';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  // providers:[LoginComponent]
})
export class NavComponent implements OnInit {

  nowUser : SocialUser = null;
  
  constructor(public _router: Router, private _auth: EPAuthService, private _gauth:AuthService) {
    
  }
  


  ngOnInit() {
    console.log("nav");
    console.log(this._auth.getToken())
  }

  //check if user login status
  chckUserLogIn():boolean{
    // var isLogIn = this._auth.chckLogIn() as any;
    var isLogIn = this._auth.getToken() as any;
    if(isLogIn){
      this._gauth.authState.subscribe((user) => { 
      this.nowUser = user; });
    }
    return isLogIn;
  }

  logOut(){
    this._auth.logOut()
  }


  //routers
  navigateSpecials(){
    this._router.navigateByUrl("/specials");
  }

  navigateParser(){
    this._router.navigateByUrl("/homes/flask");
  }

  navigateLibrary(){
    this._router.navigateByUrl("/library");
  }

  navigateQT(){
    this._router.navigateByUrl("/homes/querytest");
  }

  LineChart(){
    this._router.navigateByUrl("/homes/line-chart");
  }

  toFlask(){
    this._router.navigateByUrl("/homes/flask");
  }

  toLogin(){
    this._router.navigateByUrl("/membership/login");
  }
///../core/componets/membership/login
  toRegister(){
    this._router.navigateByUrl("/membership/register");
  }

  toEvent(){
    this._router.navigateByUrl("/membership/event");
  }

}




