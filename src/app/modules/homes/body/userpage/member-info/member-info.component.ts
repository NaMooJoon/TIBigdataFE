import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { UserProfile } from "../../../../communications/fe-backend-db/membership/user.model";

@Component({
  selector: 'app-member-info',
  templateUrl: './member-info.component.html',
  styleUrls: ['./member-info.component.less']
})
export class MemberInfoComponent implements OnInit {

  private currentUser: UserProfile;

  constructor(
    private authService: AuthService,
  ) { 
    this.authService.getCurrentUserChange().subscribe((currentUser) => {
      this.currentUser = currentUser;
      console.log(this.currentUser);
    });
  }

  ngOnInit(): void {

  }

}
