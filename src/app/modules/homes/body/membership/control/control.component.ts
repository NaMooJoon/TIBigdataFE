import { Component, OnInit } from '@angular/core';
import { IpService } from 'src/app/ip.service';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { HttpClient } from "@angular/common/http";
import { Event } from '@angular/router';

@Component({
  selector: 'app-control',
  templateUrl: './control.component.html',
  styleUrls: ['./control.component.less']
})
export class ControlComponent implements OnInit {

  constructor(private http: HttpClient, private auth: EPAuthService, private ipservice: IpService) { }
  // private userEmailReqURL: string = this.ipservice.getUserServerIp() + "/??";
  // private userGoogleReqUrl: string = this.ipservice.getUserServerIp() + ""
  private HISTORY_URL: string = this.ipservice.getFrontDBServerIp() + "/hst/getTotalHistory";
  private HISTORY_COUNT_URL: string = this.ipservice.getFrontDBServerIp() + "/hst/getHistoryCount";

  private E_USER_URL: string = this.ipservice.getFrontDBServerIp() + "/eUser/getEuserList";
  private G_USER_URL: string = this.ipservice.getFrontDBServerIp() + "/gUser/getGuserList";

  private pageNum: number = 1;//현재 몇페이지인지
  private lastPageNum: number;//마지막 페이지의 index
  private isSinglePage: boolean = true;//single page라면 버튼을 없앤다.
  private pages: any[] = [];
  // private isSudo : booelean;
  private users: any[] = [];
  private hst: any[] = [];

  private HST_PER_PAGE: number = 50;

  ngOnInit() {

    //get history count
    this.http.get<any>(this.HISTORY_COUNT_URL).subscribe((res) => {
      let count = res.payload.count;

      let startIdx = 0;
      var num = this.HST_PER_PAGE;

      if (count > 50) {
        this.isSinglePage = false;

      }

      //get total history
      this.http.post<any>(this.HISTORY_URL, { idx: startIdx, num: num }).subscribe((res) => {
        var r = res.payload.histories;
        // console.log(r);
        this.hst = [];
        for (var i = 0; i < r.length; i++) {
          var d = r[i];
          this.hst.push(
            {
              key: d.keyword,
              // time: d.year + "년" + d.month + "월" + d.date + "일" + d.hour + "시" + d.min + "분"
              time: d.time
            });
        }
        console.log(this.hst);
      });
      //create page numbers...
      this.lastPageNum = Math.floor(count / this.HST_PER_PAGE);//total pages.


      //페이지 번호 만들기
      /**
       * if 수가 50개 보다 많다? 적다?
       * 많으면 1개 이상의 페이지.
       *  if count > 50, proceed further.
       *    이전 버튼과 다음 버튼. 
       *    다음 버튼을 누르면 다음 페이지.
       *    이전 버튼을 누르면 이전 페이지.
       * 적으면 1개의 페이지.
       *  else put into array and show.
       */
      // if (this.pageNum > this.HST_PER_PAGE) {
      //   var j = 0;
      //   for (var i = 0; i < 5; i++) {
      //     this.pages[j] = i + 1;
      //     j++;
      //   }
      //   this.pages[j] = "...";
      //   j++;
      //   for (var i = 0; i < 5; i++) {
      //     this.pages[j] = this.pageNum - 5 + i;
      //     j++;
      //   }
      // }
      // else {
      //   alert("history data 수 50개 미만입니다. ");
      // }

    })


    //get email user info
    this.http.get<any>(this.E_USER_URL).subscribe((res) => {
      // console.log(r);
      if (!res.succ) {
        console.error("http request error in getting all user list in control component")
      }
      var r = res.payload;
      for (var i = 0; i < r.length; i++) {
        var d = r[i];
        // console.log(d);
        this.users.push(
          {
            email: d.email,
            inst: d.inst,
            name: d.name,
            nickname: d.nickname,
            password: d.password
          });
      }
    });
  }

  nextButton() {
    this.pageNum += 1;
    this.get_i_th_HistroyList(this.pageNum);

  }

  priorButton() {
    this.pageNum -= 1;
    this.get_i_th_HistroyList(this.pageNum);

  }

  //click buttons
  click_i_th_history(num: number): void {
    console.log(num, " button is clicked");
    this.get_i_th_HistroyList(num);
  }

  //get i-th history lists from BE server
  get_i_th_HistroyList(num: number) {
    var startIdx = num * this.HST_PER_PAGE;
    console.log("startIDx : ", startIdx);
    this.http.post<any>(this.HISTORY_URL, { idx: this.HST_PER_PAGE * num, num: this.HST_PER_PAGE }).subscribe((res) => {
      var r = res.payload.histories;
      // console.log(r);
      this.hst = [];

      for (var i = 0; i < r.length; i++) {
        var d = r[i];
        this.hst.push(
          {
            key: d.keyword,
            time: d.time
          });
      }
      console.log(this.hst);
    });
  }
}
