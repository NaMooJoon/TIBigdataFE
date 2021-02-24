import { Injectable } from "@angular/core";
import { IpService } from "src/app/core/services/ip-service/ip.service";
import { HttpClient } from "@angular/common/http";
import { CommunityPrivacyMaskingService } from "src/app/features/community-board/services/community-privacy-masking-service/community-privacy-masking.service";
import { QueryResponse } from "src/app/core/models/query.response.model";
import { CommunityDocModel } from "src/app/features/community-board/models/community.doc.model";
import moment from "moment";
import { UserProfile } from "src/app/core/models/user.model";
import { Router } from "@angular/router";

enum boardOperation {
  CREATE,
  READ,
  UPDATE,
  DELETE,
  COUNT,
  REPLY_UPDATE,
  REPLY_CREATE,
  REPLY_DELETE,
  READ_SINGLE,
  SEARCH,
  SEARCH_COUNT,
}

@Injectable({
  providedIn: "root",
})
export class CommunityBoardService {
  getCurrentUser(): UserProfile {
    throw new Error("Method not implemented.");
  }
  protected dbUrl = this.ipService.getFrontDBServerIp();
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
  private searchDocsNumUrl: string = "/searchDocsNum";
  private searchDocsUrl: string = "/searchDocs";
  private selectedDoc: CommunityDocModel;

  constructor(
    protected ipService: IpService,
    private http: HttpClient,
    private router: Router,
    private prvcyService: CommunityPrivacyMaskingService
  ) {}

  generateQueryUrl(operation: boardOperation): string {
    let currentMenu = this.getCurrentMenu();
    if (operation === boardOperation.CREATE)
      return this.dbUrl + "/" + currentMenu + this.registerDocUrl;
    if (operation === boardOperation.COUNT)
      return this.dbUrl + "/" + currentMenu + this.getDocsNumUrl;
    if (operation === boardOperation.READ)
      return this.dbUrl + "/" + currentMenu + this.getDocsUrl;
    if (operation === boardOperation.DELETE)
      return this.dbUrl + "/" + currentMenu + this.deleteDocUrl;
    if (operation === boardOperation.UPDATE)
      return this.dbUrl + "/" + currentMenu + this.modifyDocUrl;
    if (operation === boardOperation.REPLY_CREATE)
      return this.dbUrl + "/" + currentMenu + this.registerReplyUrl;
    if (operation === boardOperation.REPLY_UPDATE)
      return this.dbUrl + "/" + currentMenu + this.modifyReplyUrl;
    if (operation === boardOperation.REPLY_DELETE)
      return this.dbUrl + "/" + currentMenu + this.deleteReplyUrl;
    if (operation === boardOperation.READ_SINGLE)
      return this.dbUrl + "/" + currentMenu + this.getSingleDocUrl;
    if (operation === boardOperation.SEARCH)
      return this.dbUrl + "/" + currentMenu + this.searchDocsUrl;
    if (operation === boardOperation.SEARCH_COUNT)
      return this.dbUrl + "/" + currentMenu + this.searchDocsNumUrl;
  }

  getCurrentMenu(): string {
    return this.router.url.split('/')[2];
  }

  async getDocsNum(): Promise<number> {
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.COUNT), "")
      .toPromise();
    return res.payload["docNum"];
  }

  async registerDoc(docInfo: CommunityDocModel): Promise<QueryResponse> {
    
    return await this.http
      .post<any>(this.generateQueryUrl(boardOperation.CREATE), docInfo)
      .toPromise();
  }

  async getDocs(startIndex: number): Promise<Array<CommunityDocModel>> {
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.READ), {
        startIndex: startIndex,
      })
      .toPromise();
    if (res.isSuccess) {
      return res.payload["docList"];
    } else {
      return null;
    }
  }

  async getSelectedDoc(): Promise<CommunityDocModel> {
    
    if (this.selectedDoc == null) return null;
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.READ_SINGLE), {
        docId: this.selectedDoc.docId,
      })
      .toPromise();
    
    return res.payload;
  }

  async getMainAnnounceDocs(): Promise<Array<CommunityDocModel>> {
    let res: QueryResponse = await this.http
      .post<any>(
        this.dbUrl + "/" + this.getCurrentMenu() + this.getMainAnnounceDocsUrl,
        ""
      )
      .toPromise();
    
    if (res.isSuccess) {
      return res.payload["docList"];
    } else {
      return null;
    }
  }

  async deleteDocs(docId: number): Promise<boolean> {
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.DELETE), { docId: docId })
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  async deleteReply(docId: number): Promise<boolean> {
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.REPLY_DELETE), {
        docId: docId,
      })
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  async modifyDoc(docInfo: CommunityDocModel): Promise<boolean> {
    
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.UPDATE), docInfo)
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  async registerReply(docInfo: CommunityDocModel): Promise<boolean> {
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.REPLY_CREATE), docInfo)
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  async modifyReply(docInfo: CommunityDocModel): Promise<boolean> {
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.REPLY_UPDATE), docInfo)
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  async searchDocs(searchText: string): Promise<Array<CommunityDocModel>> {
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.SEARCH), {
        searchText: searchText,
      })
      .toPromise();
    
    if (res.isSuccess) return res.payload["docList"];
  }

  async getSearchDocsNum(searchText: string): Promise<number> {
    let res: QueryResponse = await this.http
      .post<any>(this.generateQueryUrl(boardOperation.SEARCH_COUNT), {
        searchText: searchText,
      })
      .toPromise();
    
    if (res.isSuccess) return res.payload["docNum"];
  }

  verifyPrivacyLeak(content: string): string {
    let filteredContent: string = this.prvcyService.checkAllPrivacyLeak(
      content
    );
    return filteredContent;
  }

  formatDate(date: string): string {
    return moment(date).format("YY-MM-DD");
  }

  setSelectedDoc(doc: CommunityDocModel) {
    this.selectedDoc = doc;
  }
}
