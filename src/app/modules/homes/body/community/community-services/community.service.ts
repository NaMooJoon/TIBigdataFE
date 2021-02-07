import { Injectable } from '@angular/core';
import { IpService } from 'src/app/ip.service';
import { HttpClient } from "@angular/common/http";
import { CommunityPrivacyMaskingService } from 'src/app/modules/homes/body/community/community-services/community-privacy-masking.service';
import { Res } from '../../../../communications/fe-backend-db/res.model';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommunityDocModel } from '../community.doc.model';

enum boardOperation { CREATE, READ, UPDATE, DELETE, COUNT, LOAD }
export enum boardMenu { ANNOUNCE, QNA, FAQ }

@Injectable({
  providedIn: 'root'
})
export class CommunityService {

  protected dbUrl = this.ipService.getFrontDBServerIp();
  private currentMenu: string = null;
  private registerDocUrl: string = "/registerDoc";
  private getDocsNumUrl: string = "/getDocsNum";
  private getDocsUrl: string = "/getDocs";
  private getMainAnnounceDocsUrl: string = "/getMainAnnounceDocs";
  private deleteDocUrl: string = "/deleteDoc";
  private modifyDocUrl: string = "/modDoc";

  private boardMenuChange$: BehaviorSubject<boardMenu> = new BehaviorSubject(boardMenu.ANNOUNCE);//to stream to subscribers
  private selectedDoc: CommunityDocModel;


  constructor(
    protected ipService: IpService,
    private http: HttpClient,
    private prvcyService: CommunityPrivacyMaskingService,
    private authService: EPAuthService
  ) { }

  generateQueryUrl(operation: boardOperation): string {
    if (operation === boardOperation.CREATE)
      return this.dbUrl + "/" + this.currentMenu + this.registerDocUrl;
    if (operation === boardOperation.READ)
      return this.dbUrl + "/" + this.currentMenu + this.getDocsNumUrl;
    if (operation === boardOperation.LOAD)
      return this.dbUrl + "/" + this.currentMenu + this.getDocsUrl;
    if (operation === boardOperation.DELETE)
      return this.dbUrl + "/" + this.currentMenu + this.deleteDocUrl;
    if (operation === boardOperation.UPDATE)
      return this.dbUrl + "/" + this.currentMenu + this.modifyDocUrl;
  }

  getCurrentMenu(): string {
    return this.currentMenu;
  }

  getBoardMenuChange(): Observable<boardMenu> {
    return this.boardMenuChange$.asObservable();
  }

  async getDocsNum(): Promise<number> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.READ), "").toPromise();
    return res.payload['docNum'];
  }

  async registerDoc(docInfo: CommunityDocModel): Promise<Res> {
    return await this.http.post<any>(this.generateQueryUrl(boardOperation.CREATE), docInfo).toPromise();
  }

  async getDocs(startIndex: number): Promise<Array<CommunityDocModel>> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.LOAD), { 'startIndex': startIndex }).toPromise();
    if (res.succ) {
      return res.payload['docList'];
    }
    else {
      return null;
    }
  }

  async getMainAnnounceDocs(): Promise<Array<CommunityDocModel>> {
    let res: Res = await this.http.post<any>(this.dbUrl + "/" + this.currentMenu + this.getMainAnnounceDocsUrl, "").toPromise();
    console.log(res);
    if (res.succ) {
      return res.payload['docList'];
    }
    else {
      return null;
    }
  }

  async deleteDocs(docId: number): Promise<boolean> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.DELETE), { 'docId': docId }).toPromise();
    if (res.succ) return true;
    else return false;
  }

  async modifyDoc(docInfo: CommunityDocModel): Promise<boolean> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.UPDATE), docInfo).toPromise();
    if (res.succ) return true;
    else return false;
  }

  verifyPrivacyLeak(content: string): string {
    return content;
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

  setSelectedDoc(doc: CommunityDocModel) {
    this.selectedDoc = doc;
  }

  getSelectedDoc() {
    return this.selectedDoc;
  }

}
