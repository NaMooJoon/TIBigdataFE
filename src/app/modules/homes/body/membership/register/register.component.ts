import { Component, OnInit } from '@angular/core';
import { AuthEmailService } from '../../../../communications/fe-backend-db/membership/auth-email.service';//register user service
import { Router } from '@angular/router'
class userProfile{
  nickName : String;
  name : String;
  inst : String;//institution
  email : String;
  password : String;
}



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.less']
})

export class RegisterComponent implements OnInit {

  // when input info(email and password), add data into object.
  registerUserData = new userProfile();
  private pw1="";
  private pw2="";
  constructor(private eAuth: AuthEmailService, private _router: Router) { }

  ngOnInit() {
    this.initialize_data();
  }

  initialize_data(){
    this.pw1 = "";
    this.pw2 = "";
    this.registerUserData = new userProfile();
  }

  checkIfValid(){
    // console.log(this.pw1)
    // console.log(this.pw2)
    return this.pw1 == this.pw2;
  }

  // when button clicked, this func init.
  async registerUser(){
    if(this.pw1 == this.pw2)//check for sure
      this.registerUserData.password = this.pw1;
    console.log(this.registerUserData);
    await this.eAuth.register(this.registerUserData) //_auth : register user service
    this._router.navigate(['/homes'])
    // console.log(this.registerUserData);
    // this.eAuth.register(this.registerUserData) //_auth : register user service
  }
  
  toSocReg(){
    this._router.navigateByUrl("/membership/socReg");
  }

}
