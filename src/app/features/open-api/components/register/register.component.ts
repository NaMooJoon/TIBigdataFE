import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { UserProfile } from "src/app/core/models/user.model";
import { APIService } from "src/app/core/services/api-database-service/api-database.service";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { ManagementComponent } from "../management/management.component";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.less"],
})
export class RegisterComponent implements OnInit{

    userProfile: UserProfile;
    ngOnInit(){
    }

    constructor(
        public router: Router,
        public apiService: APIService, 
        private authenticationService: AuthenticationService
        ) {
          this.authenticationService.getCurrentUserChange().subscribe((currentUser) => {
            this.userProfile = currentUser;
          });
        }

    async register():Promise<void>{
        let app_name:string = (<HTMLInputElement>document.getElementById('app_name')).value;
        let app_purpose:string = (<HTMLInputElement>document.getElementById('app_purpose')).value;
        let authKey = (await this.apiService.register(this.userProfile.email, app_name,app_purpose)).authKey;
        prompt('성공적으로 활용이 등록되었습니다.\n인증키를 복사하세요.',authKey);
        return this.toManagement();
      }
    
    toManagement(){
        this.router.navigateByUrl("/openapi/management");
        this.ngOnInit();
    }
}