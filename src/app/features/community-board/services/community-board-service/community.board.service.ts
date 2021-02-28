import { Injectable } from "@angular/core";
import { IpService } from "src/app/core/services/ip-service/ip.service";
import { HttpClient } from "@angular/common/http";
import { CommunityPrivacyMaskingService } from "src/app/features/community-board/services/community-privacy-masking-service/community-privacy-masking.service";
import { QueryResponse } from "src/app/core/models/query.response.model";
import { CommunityDocModel } from "src/app/features/community-board/models/community.doc.model";
import moment from "moment";
import { UserProfile } from "src/app/core/models/user.model";
import { Router } from "@angular/router";
import { boardOperation } from "src/app/features/community-board/enums/boardOperation";

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
    private httpClient: HttpClient,
    private router: Router,
    private communityPrivacyMaskingService: CommunityPrivacyMaskingService
  ) { }

  /**
   * @description Generate query api url according to the operation and current menu
   * @param operation Operation to do.
   */
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

  /**
   * @description Parse current route url and get current menu.
   * @returns current menu
   */
  getCurrentMenu(): string {
    return this.router.url.split('/')[2];
  }

  /**
   * @description Send query to get number of documents
   * @returns number of documents
   */
  async getDocsNum(): Promise<number> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.COUNT), "")
      .toPromise();
    return res.payload["docNum"];
  }

  /**
   * @description Send query to register new document.
   * @returns query result
   */
  async registerDoc(docInfo: CommunityDocModel): Promise<QueryResponse> {
    return await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.CREATE), docInfo)
      .toPromise();
  }

  /**
   * @description Send query to get list of documents.
   * @param startIndex Index that indicates where to start search.
   * @returns list of documents
   */
  async getDocs(startIndex: number): Promise<Array<CommunityDocModel>> {
    let res: QueryResponse = await this.httpClient
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

  /**
   * @description Send query to get single document.
   * @returns document object
   */
  async getSelectedDoc(): Promise<CommunityDocModel> {
    if (this.selectedDoc == null) return null;
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.READ_SINGLE), {
        docId: this.selectedDoc.docId,
      })
      .toPromise();

    return res.payload;
  }

  /**
   * @description Send query to get documents that are marked as a main announcement.
   * @returns list of main announcement documents
   */
  async getMainAnnounceDocs(): Promise<Array<CommunityDocModel>> {
    let res: QueryResponse = await this.httpClient
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

  /**
   * @description Send query to delete selected document.
   * @param docId id of document to delete.
   * @returns deleting result. Return true if the deletion successfully done. It not, return false.
   */
  async deleteDocs(docId: number): Promise<boolean> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.DELETE), { docId: docId })
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  /**
   * @description Send query to delete selected reply.
   * @param docId id of document that has reply to delete.
   * @returns deleting result. Return true if the deletion successfully done. It not, return false.
   */
  async deleteReply(docId: number): Promise<boolean> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.REPLY_DELETE), {
        docId: docId,
      })
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  /**
   * @description Send query to modify selected document.
   * @param docId id of document to modify.
   * @returns modifying result. Return true if the modification successfully done. It not, return false.
   */
  async modifyDoc(docInfo: CommunityDocModel): Promise<boolean> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.UPDATE), docInfo)
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  /**
   * @description Send query to register new reply on selected document.
   * @param docInfo Document to register new reply. 
   * @returns registration result. Return true if the registration successfully done. It not, return false.
   */
  async registerReply(docInfo: CommunityDocModel): Promise<boolean> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.REPLY_CREATE), docInfo)
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  /**
   * @description Send query to modify selected reply.
   * @param docInfo Document that has reply to modify.
   * @returns modifying result. Return true if the modification successfully done. It not, return false.
   */
  async modifyReply(docInfo: CommunityDocModel): Promise<boolean> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.REPLY_UPDATE), docInfo)
      .toPromise();
    if (res.isSuccess) return true;
    else return false;
  }

  /**
   * @description Send query to get list of documents that matches with given search keyword.
   * @param searchText keyword to search.
   * @returns list of matching documents
   */
  async searchDocs(searchText: string): Promise<Array<CommunityDocModel>> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.SEARCH), {
        searchText: searchText,
      })
      .toPromise();

    if (res.isSuccess) return res.payload["docList"];
  }

  /**
   * @description Send query to get number of documents that matches with search keyword.
   * @param searchText keyword to search.
   * @returns number of documents
   */
  async getSearchDocsNum(searchText: string): Promise<number> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.generateQueryUrl(boardOperation.SEARCH_COUNT), {
        searchText: searchText,
      })
      .toPromise();

    if (res.isSuccess) return res.payload["docNum"];
  }

  /**
   * @description Verify document content to filter all privacy leak.
   * @param content document content to apply filter
   * @returns filtered content
   */
  verifyPrivacyLeak(content: string): string {
    let filteredContent: string = this.communityPrivacyMaskingService.checkAllPrivacyLeak(content);
    return filteredContent;
  }

  /**
   * @description Update selected document.
   * @param doc selected document model.
   */
  setSelectedDoc(doc: CommunityDocModel) {
    this.selectedDoc = doc;
  }
}
