import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IpService } from 'src/app/ip.service'


@Injectable({
  providedIn: 'root'
})
export class EventService {

  private _eventsUrl = this.ipService.get_FE_DB_ServerIp() + "/api/events";
  private _srchHstUrl = this.ipService.get_FE_DB_ServerIp() + "/api/searchHistory";
  private srchHst : string[] = [];


  constructor(private http: HttpClient,private ipService : IpService) { }

  getEvents(){
    return this.http.get<any>(this._eventsUrl);
  }

  addSrchHst(hst:string){
    this.srchHst.push(hst);
  }

  getSrchHst(){
    return this.srchHst;
  }
}
