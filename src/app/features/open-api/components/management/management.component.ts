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
  }

  async loadInfo(){
    let info=await this.apiService.getApiInfos(this.userProfile.email);
    this.count = info.count;
    this.infos= info.info;
    console.log(this.infos);
    this.name=this.userProfile.name;
  }

  async reissue(_id:string): Promise<void>{
    let authKey = (await this.apiService.reissueKey(_id)).authKey;
    prompt('성공적으로 인증키가 변경되었습니다.\n복사하세요.',authKey);
    this.ngOnInit();
    return ;
  }

  async delete(_id:string): Promise<void>{
    if ((await this.apiService.delete(_id)).succeed)
      alert('성공적으로 삭제되었습니다');
    else alert('삭제중에 문제가 발생했습니다.');
    this.ngOnInit();
    return ;
  }

  toRegister(){
    this.router.navigateByUrl("/openapi/register");
    this.ngOnInit();
  }

}
