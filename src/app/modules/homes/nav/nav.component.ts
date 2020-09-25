import { Component, AfterViewChecked,OnInit, OnChanges, Output, EventEmitter, NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { EPAuthService } from '../../communications/fe-backend-db/membership/auth.service';
// import { LoginComponent} from '../../core/componets/membership/login/login.component';
import { UserpageComponent } from '../body/membership/userpage/userpage.component';
import { SocialUser, AuthService} from 'angularx-social-login';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.less'],
  // providers:[LoginComponent]
})
export class NavComponent implements OnInit {

  private nowUser : String = null;
  private isLogin : boolean = false;
  constructor(public _router: Router, private auth: EPAuthService, private _gauth:AuthService) {
    
  }
  ngOnInit(): void {
    //그냥 static 변수를 그대로 가지고 올 수 없는 이유 : afterviewinit error 발생.
    //service에서 observable으로 가지고 오는 것이 가장 편하다.
    this.auth.verifySignIn();
    this.auth.getLogInObs().subscribe((logInStat)=>{
      // console.log("stat update! ", logInStat);
      this.isLogin = logInStat as any;//should i set this any really? what about logStat?
      // this.auth.setLogStat(logInStat);
      if(logInStat > 0)//only when user is already login, update name
        this.nowUser = this.auth.getUserName();
      
    });
  }
  


  //AfterViewChecked() {
    // console.log("nav");
    // console.log(this.auth.getToken())
  //}

  //check if user login status
  // chckUserLogIn():boolean{
  //   // return false;
  //   if(this.auth.chckLogIn()){
  //     // console.log(this.auth.chckLogIn())
  //     this.nowUser = this.auth.getNowUser();
  //     return true;
  //   }
  //   return false
  //   //prior version
  //   // // var isLogIn = this.auth.chckLogIn() as any;
  //   // var isLogIn = this.auth.getToken() as any;
  //   // if(isLogIn){
  //   //   this._gauth.authState.subscribe((user) => { 
  //   //   this.nowUser = user; });
  //   // }
  //   // return isLogIn;
  // }

  logOut(){
    console.log("logout func init");
    this.auth.logOut();
  }

  ready(){
    alert("준비중입니다");
  }
  //routers
  navigateSpecials(){
    this._router.navigateByUrl("/body/specials");
  }

  navigateParser(){
    this._router.navigateByUrl("/homes/flask");
  }

  navigateLibrary(){
    this._router.navigateByUrl("/body/library");
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

  toHomes(){
    this._router.navigateByUrl("/homes");
  }

  toLogin(){
    this._router.navigateByUrl("/body/membership/login");
  }
///../core/componetsmembership/login
  toRegister(){
    // console.log("in the toReg func")
    this._router.navigateByUrl("/body/membership/register");
  }

  toEvent(){
    this._router.navigateByUrl("/body/membership/event");
  }

  toUserPage(){
    this._router.navigateByUrl("/body/membership/userpage");
  }

  toControl(){
    this._router.navigateByUrl("/body/membership/control");
  }

  toCommunity(){
    this._router.navigateByUrl("/body/community")
  }
  
  toAnnouncement(){
    this._router.navigateByUrl("/body/community/announcement");
  }

  toFaq(){
    this._router.navigateByUrl("/body/community/faq");
  }
}




