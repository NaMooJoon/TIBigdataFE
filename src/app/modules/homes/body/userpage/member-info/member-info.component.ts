import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../communications/fe-backend-db/membership/auth.service';

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.less']
})
export class MemberInfoComponent implements OnInit {

  private name: String;
  private email: String;
  private nickName: String;
  private inst: String;

  constructor(
    private _auth: AuthService,
  ) { }

  ngOnInit(): void {


  }

}
