/**
 * writer : baek
 * file : ip.service.ts
 * 
 * purpose : 
 *  서버와 로컬에서 작동되는 ip가 달라서 
 *  여러가지 문제가 발생.
 *  ip.service을 통해 자동으로 ip을 확인해서 알아서 바꿔줌.
 * 
 * problem : 
 *  Angular에서 flask으로 쿼리를 보낼 때, 
 *  서버에서는 flask 주소가 localhost가 아니라 서버의 
 *  ip주소가 되어야 한다. 서버에서 localhost으로 하면 응답을 
 *  못받음.
 *  반면, 로컬에서 코드를 업데이트 하려면 flask의 주소를 
 *  localhost으로 설정해야 한다.
 *  따라서 깃헙 레포에 업데이트 할 때, 서버에서 동작시킬 때,
 *  일일히 바꿔줘야 함. 유지 보수가 어려움 + 가끔 원인을 모르게 
 *  동작을 안할 때는 이 경우인 경우가 많다.
 * 
 * date : 2020 02 16
 * 
 * usage : 
 *  flask와 통신하는 component나 container에서
 *  이 service을 inject해서 getCommonIp() 호출한 뒤
 *  기타 주소와 포트는 manually 삽입.
 * 
 *  i.e. private ipAdd = IpService.getCommonIp+":5000/LDA";
 * 
 *  
 * 
 * 
 */

import { Injectable } from '@angular/core';
//import { currentId } from 'async_hooks';

@Injectable({
  providedIn: 'root'
})
export class IpService {

  private FrontEnd_SERVER_IP = "http://203.252.112.15";
  private DEV_IP = "http://localhost";

  private BackEnd_SERVER_IP = "http://203.252.112.14";

  USER_BE_PORT = "4000";
  FLASK_PORT = "5000";
  ES_PORT = "9200";
  ES_INDEX = "/nkdb0919";
  ANGULAR_PORT = "4200";
  


  constructor() { }

  getCurrIp(){
    let ipArr = window.location.origin.split(/:[0-9]+/);
    return ipArr[0];
  }

  getAngularPort(){
    return this.ANGULAR_PORT;
  }

  adaptIp(whichServerIp:string){
    let currIp = this.getCurrIp()
    // this.ES_INDEX = "/capstone";//REPLACE WITH nkdb after capstone
    if (currIp != this.FrontEnd_SERVER_IP || currIp != this.BackEnd_SERVER_IP){
      return this.DEV_IP;
      //console.log(currIp);
    }
    else{
      return whichServerIp;
    }
  }

  get_FE_Ip(){
    return this.FrontEnd_SERVER_IP;
  }

  get_FE_DB_ServerIp(){
    // return this.FrontEnd_SERVER_IP+":"+this.USER_BE_PORT;
    return this.adaptIp(this.FrontEnd_SERVER_IP)+":"+this.USER_BE_PORT;
  }

  getMiddlewareServerIp(){
    // return this.FrontEnd_SERVER_IP + ":"+this.FLASK_PORT;
    return this.adaptIp(this.FrontEnd_SERVER_IP)+":"+this.FLASK_PORT;
  }

  getBackEndServerIp(){
    // return this.BackEnd_SERVER_IP + ":"+this.ES_PORT + this.ES_INDEX;

    //use local elasticsearch
    return this.adaptIp(this.BackEnd_SERVER_IP) + ":"+this.ES_PORT + this.ES_INDEX;
  }

  getDevIp(){
    return this.DEV_IP+":"+this.USER_BE_PORT;;
  }
}


