import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { IpService } from "src/app/ip.service";
import { Router } from "@angular/router";
// import { IdControlService } from "../id-control-service/id-control.service";
import { IdControlService } from '../id-control-service/id-control.service';

// import {SearchModule} from '../../search.module'

@Injectable({
  providedIn: "root"
})
export class RecommendationService {
  constructor(private ipService: IpService, private http: HttpClient,
    private _router: Router,
    private idControl: IdControlService) { }
  // private idList: string[] = [];
  private RCMD_URL: string = this.ipService.getFrontDBServerIp() + ":5000/rcmd";
  private isInfoLoaded: boolean = false;
  rcmdList: {};
  private headers: HttpHeaders = new HttpHeaders({
    "Content-Type": "application/json"
  });

  getRcmd(idList: Array<string>) {
    return this.http.post(this.RCMD_URL, { idList: idList }, { headers: this.headers }).toPromise()
  }
}
