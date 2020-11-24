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

  toHome() {
    this._router.navigateByUrl("/homes");
  }

  toApiReg() {
    this._router.navigateByUrl("/api-register");
  }
}
