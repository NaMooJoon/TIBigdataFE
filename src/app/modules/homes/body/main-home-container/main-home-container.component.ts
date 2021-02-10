import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../communications/fe-backend-db/membership/auth.service';
import { SocialAuthService } from 'angularx-social-login'

@Component({
  selector: 'app-main-home-container',
  templateUrl: './main-home-container.component.html',
  styleUrls: ['./main-home-container.component.less']
})
export class MainHomeContainerComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {

  }

}
