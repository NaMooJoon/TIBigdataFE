import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UserProfile } from "src/app/core/models/user.model";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.less"],
})
export class RegisterComponent implements OnInit {
  private _registerForm: FormGroup;
  private _statusList: Array<string> = [
    "대학생",
    "석사",
    "박사",
    "연구원",
    "기타",
  ];

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      status: new FormControl("", [Validators.required]),
      inst: new FormControl("", [Validators.required]),
      policy1Agreed: new FormControl(false, [Validators.requiredTrue]),
      policy2Agreed: new FormControl(false, [Validators.requiredTrue]),
    });
  }

  /**
   * @description Register the user with information of user 
   */
  async registerUser(): Promise<void> {
    let userData: UserProfile = new UserProfile();
    userData.inst = this.registerForm.get("inst").value;
    userData.status = this.registerForm.get("status").value;
    let result = await this.authService.register(userData);

    if (result) {
      window.alert("회원가입이 완료되었습니다.");
      this.router.navigateByUrl("/register-ok");
    } else {
      window.alert("이미 가입된 회원입니다. 로그인해주세요.");
      this.router.navigateByUrl("/login");
    }
  }

  public get registerForm(): FormGroup {
    return this._registerForm;
  }
  public set registerForm(value: FormGroup) {
    this._registerForm = value;
  }
  public get statusList(): Array<string> {
    return this._statusList;
  }
  public set statusList(value: Array<string>) {
    this._statusList = value;
  }
}
