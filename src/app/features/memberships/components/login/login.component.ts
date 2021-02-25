import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.less"],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit() { }

  /**
   * @description Check if sign in is success and move to appropriate page 
   */
  async signIn() {
    let isSuccess = await this.authService.signIn();
    if (isSuccess) {
      this.router.navigateByUrl("/");
    } else {
      window.alert("가입되지 않은 회원입니다. 가입 후 이용해주세요 :)");
      this.router.navigateByUrl("/register");
    }
  }
}
