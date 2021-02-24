import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";

@Component({
  selector: "app-api-register",
  templateUrl: "./api-register.component.html",
  styleUrls: ["./api-register.component.less"],
})
export class ApiRegisterComponent implements OnInit {
  private _userAuthType = null;
  private isLogIn: Boolean;

  constructor(
    private authenticationService: AuthenticationService,
    private _router: Router
  ) { }

  async ngOnInit() { }

  async registerApi(): Promise<void> {
    await this.authenticationService.apiRegister();
  }
}
