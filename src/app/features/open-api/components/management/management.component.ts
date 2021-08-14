import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { UserProfile } from "src/app/core/models/user.model";
import { APIService } from "src/app/core/services/api-database-service/api-database.service";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";

@Component({
  selector: "app-management",
  templateUrl: "./management.component.html",
  styleUrls: ["./management.component.less"],
})
export class ManagementComponent implements OnInit {
  userProfile: UserProfile;
  name:string;
  count: number;
  public infos: { app_name: string; app_purpose: string; user_email: string; reporting_date: string; expiration_date: string; traffic: number; }[];

  constructor(
    public router: Router,
    public apiService: APIService,
    private authenticationService: AuthenticationService
    ) {
      this.authenticationService.getCurrentUserChange().subscribe((currentUser) => {
        this.userProfile = currentUser;
      });
    }

  ngOnInit() {
    this.loadInfo();
    // this.count = 3;
  }

  async loadInfo(){
    let info=await this.apiService.getApiInfos(this.userProfile.email);
    this.count = info.count;
    this.infos= info.info;
    console.log(this.infos);
    this.name=this.userProfile.name;
  }

  // /**
  //  * @description Router to intro page
  //  */
  // toSiteIntro() {
  //   this.router.navigateByUrl("/introduce/intro");
  // }

  // /**
  //  * @description Router to service guide page 
  //  */
  // toServiceGuide() {
  //   this.router.navigateByUrl("/introduce/service-guide");
  // }

  // /**
  //  * @description Router to collected info page 
  //  */
  // toCollectedInfo() {
  //   this.router.navigateByUrl("/introduce/collected-info");
  // }

  // /**
  //  * @description Router to member policy page 
  //  */
  // toMemberPolicy() {
  //   this.router.navigateByUrl("/introduce/member-policy");
  // }
}
