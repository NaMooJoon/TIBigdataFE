import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../../../../core/services/authentication-service/authentication.service';

@Component({
  selector: 'app-secession',
  templateUrl: './secession.component.html',
  styleUrls: ['./secession.component.less']
})
export class SecessionComponent implements OnInit {

  constructor(
    private authService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  async deleteUser() {
    if(confirm("삭제된 데이터는 되돌려 드리지 않습니다.\n정말 탈퇴하시겠습니까?") == true){

      let res = await this.authService.deleteUser();
      if (res) {
        alert("탈퇴가 완료되었습니다.");
      }
      else {
        alert("다시 시도해주세요.");
      }
      this.authService.signOut();
    }
  }

}
