import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-register-ok',
  templateUrl: './register-ok.component.html',
  styleUrls: ['./register-ok.component.less']
})
export class RegisterOkComponent implements OnInit {

  constructor(private activateRoute: ActivatedRoute, private _router: Router) { };

  private userEmail = null;

  ngOnInit() {
  }

  /**
   * @description Router to home page 
   */
  toHome() {
    this._router.navigateByUrl("/homes");
  }

  /**
   * @description Router to login page
   */
  toLogIn() {
    this._router.navigateByUrl("/login");
  }
}
