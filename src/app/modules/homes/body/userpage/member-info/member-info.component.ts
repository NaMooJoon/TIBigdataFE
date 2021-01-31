import { Component, OnInit } from '@angular/core';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';

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
    private _auth: EPAuthService,
  ) { }

  ngOnInit(): void {
    
    this.name = this._auth.getUserName();
    this.email = this._auth.getUserEmail();
    this.nickName = this._auth.getUserNickname();
    this.inst = this._auth.getUserInst();

  }

}
