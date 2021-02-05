import { Injectable } from '@angular/core';
import { IpService } from 'src/app/ip.service';
import { HttpClient } from "@angular/common/http";
import { CommunityPrivacyMaskingService } from 'src/app/modules/homes/body/community/community-services/community-privacy-masking.service';
import { Res } from '../../../../communications/fe-backend-db/res.model';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';

enum boardOperation { CREATE, READ, UPDATE, DELETE, COUNT, LOAD }
export enum boardMenu { ANNOUNCE, QNA, FAQ }

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  protected dbUrl = this.ipService.getFrontDBServerIp();
  private currentMenu: string;
  private registerDocUrl: string = "/registerDoc";
  private getDocsNumUrl: string = "/getDocsNum";
  private getDocsUrl: string = "/getDocs"

  private boardMenuChange$: BehaviorSubject<boardMenu> = new BehaviorSubject(boardMenu.ANNOUNCE);//to stream to subscribers
  private docList: {}[] = [];

  private DOC_NUM_PER_EACH_PAGE = 10;

  private selectedDoc = {};
  constructor(
    protected ipService: IpService,
    private http: HttpClient,
    private prvcyService: CommunityPrivacyMaskingService,
    private authService: EPAuthService
  ) { console.log('cmservice init') }



  generateQueryUrl(operation: boardOperation): string {
    if (operation === boardOperation.CREATE)
      return this.dbUrl + "/" + this.currentMenu + this.registerDocUrl;
    if (operation === boardOperation.READ)
      return this.dbUrl + "/" + this.currentMenu + this.getDocsNumUrl;
    if (operation === boardOperation.LOAD)
      return this.dbUrl + "/" + this.currentMenu + this.getDocsUrl;
  }

  chooseDoc(i: number): void {
    this.selectedDoc["user"] = this.docList[i]["user"];
    this.selectedDoc["content"] = this.docList[i]["content"];
    this.selectedDoc["title"] = this.docList[i]["title"];
  }

  getChosenDoc(): Object {
    return this.selectedDoc;
  }
  getCurrentMenu(): string {
    return this.currentMenu;
  }

  getBoardMenuChange(): Observable<boardMenu> {
    return this.boardMenuChange$.asObservable();
  }

  getEachPageDocNum() {
    return this.DOC_NUM_PER_EACH_PAGE;
  }

  async getDocsNum(): Promise<Res> {
    return await this.http.post<any>(this.generateQueryUrl(boardOperation.READ), "").toPromise();
  }

  async registerDoc(docInfo: { title: string, content: string, isMain?: boolean }): Promise<Res> {
    docInfo['userEmail'] = this.authService.getUserEmail();
    docInfo['userName'] = this.authService.getUserName();

    return await this.http.post<any>(this.generateQueryUrl(boardOperation.CREATE), docInfo).toPromise();

  }

  async getDocs(startIndex: number): Promise<Object> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.LOAD), { 'startIndex': startIndex }).toPromise();
    if (res.succ) {
      console.log('res', res);
      return res.payload;
    }
    else {
      return null;
    }
  }

  verifyPrivacyLeak(title: string, body: string): { title: string, body: string } {
    title = this.prvcyService.checkAllPrivacyLeak(title);
    body = this.prvcyService.checkAllPrivacyLeak(body);
    return { title: title, body: body };
  }

  setBoardMenu(menu: boardMenu) {
    if (menu === boardMenu.ANNOUNCE) this.currentMenu = 'announcement';
    if (menu === boardMenu.FAQ) this.currentMenu = 'faq';
    if (menu === boardMenu.QNA) this.currentMenu = 'qna';

    this.boardMenuChange$.next(menu);
  }

  formatDate(date: string) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }
}
