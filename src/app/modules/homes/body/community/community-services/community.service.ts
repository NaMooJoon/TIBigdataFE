import { Injectable } from '@angular/core';
import { IpService } from 'src/app/ip.service';
import { HttpClient } from "@angular/common/http";
import { CommunityPrivacyMaskingService } from 'src/app/modules/homes/body/community/community-services/community-privacy-masking.service';
import { Res } from '../../../../communications/fe-backend-db/res.model';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { CommunityDocModel } from '../community.doc.model';
import moment from 'moment';

enum boardOperation { CREATE, READ, UPDATE, DELETE, COUNT, REPLY_UPDATE, REPLY_CREATE, REPLY_DELETE, READ_SINGLE }
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
  private registerReplyUrl: string = "/modReply";
  private modifyReplyUrl: string = "/registerReply";
  private getSingleDocUrl: string = "/getSingleDoc";
  private deleteReplyUrl: string = "/deleteReply";

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
    if (operation === boardOperation.COUNT)
      return this.dbUrl + "/" + this.currentMenu + this.getDocsNumUrl;
    if (operation === boardOperation.READ)
      return this.dbUrl + "/" + this.currentMenu + this.getDocsUrl;
    if (operation === boardOperation.DELETE)
      return this.dbUrl + "/" + this.currentMenu + this.deleteDocUrl;
    if (operation === boardOperation.UPDATE)
      return this.dbUrl + "/" + this.currentMenu + this.modifyDocUrl;
    if (operation === boardOperation.REPLY_CREATE)
      return this.dbUrl + "/" + this.currentMenu + this.registerReplyUrl;
    if (operation === boardOperation.REPLY_UPDATE)
      return this.dbUrl + "/" + this.currentMenu + this.modifyReplyUrl;
    if (operation === boardOperation.REPLY_DELETE)
      return this.dbUrl + "/" + this.currentMenu + this.deleteReplyUrl;
    if (operation === boardOperation.READ_SINGLE)
      return this.dbUrl + "/" + this.currentMenu + this.getSingleDocUrl;
  }

  getCurrentMenu(): string {
    return this.currentMenu;
  }

  getBoardMenuChange(): Observable<boardMenu> {
    return this.boardMenuChange$.asObservable();
  }

  async getDocsNum(): Promise<number> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.COUNT), "").toPromise();
    return res.payload['docNum'];
  }

  async registerDoc(docInfo: CommunityDocModel): Promise<Res> {
    return await this.http.post<any>(this.generateQueryUrl(boardOperation.CREATE), docInfo).toPromise();
  }

  async getDocs(startIndex: number): Promise<Array<CommunityDocModel>> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.READ), { 'startIndex': startIndex }).toPromise();
    if (res.succ) {
      return res.payload['docList'];
    }
    else {
      return null;
    }
  }

  async getSelectedDoc(): Promise<CommunityDocModel> {
    if (this.selectedDoc == null) return null;
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.READ_SINGLE), { 'docId': this.selectedDoc.docId }).toPromise();
    return res.payload;
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

  async deleteReply(docId: number): Promise<boolean> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.REPLY_DELETE), { 'docId': docId }).toPromise();
    if (res.succ) return true;
    else return false;
  }

  async modifyDoc(docInfo: CommunityDocModel): Promise<boolean> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.UPDATE), docInfo).toPromise();
    if (res.succ) return true;
    else return false;
  }

  async registerReply(docInfo: CommunityDocModel): Promise<boolean> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.REPLY_CREATE), docInfo).toPromise();
    if (res.succ) return true;
    else return false;
  }

  async modifyReply(docInfo: CommunityDocModel): Promise<boolean> {
    let res: Res = await this.http.post<any>(this.generateQueryUrl(boardOperation.REPLY_UPDATE), docInfo).toPromise();
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
    return moment(date).format('YY-MM-DD');
  }

  setSelectedDoc(doc: CommunityDocModel) {
    this.selectedDoc = doc;
  }

}
