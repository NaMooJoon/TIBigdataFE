import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { QueryResponse } from "src/app/core/models/query.response.model";
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { UserProfile } from "src/app/core/models/user.model";
import { IpService } from "../ip-service/ip.service";

@Injectable({
  providedIn: "root",
})
export class UserSavedDocumentService {
  private API_URL: string = this.ipService.getFrontDBServerIp();
  private saveMyDocUrl = this.API_URL + "/myDoc/saveMyDoc";
  private getMyDocUrl = this.API_URL + "/myDoc/getMyDoc";
  private deleteAllMyDocUrl = this.API_URL + "/myDoc/deleteAllMyDocs";
  private currentUser: UserProfile;
  private docsPerPage: number = 10;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthenticationService,
    private articleService: ArticleService,
    private ipService: IpService
  ) {
    this.authService.getCurrentUserChange().subscribe((currentUser) => {
      this.currentUser = currentUser;

    });
  }

  /**
   * @description Send query of saving list of article ids into saved document list 
   * @param docIds list of article ids to save
   * @returns returns true if the saving success, else return false.
   */
  async saveNewMyDoc(docIds: Array<string>): Promise<boolean> {
    let payload = { userEmail: this.currentUser.email, docIds: docIds };
    let res = await this.httpClient
      .post<any>(this.saveMyDocUrl, payload)
      .toPromise();
    return res.succ;
  }

  /**
   * @description Send query to get list of saved articles.
   * @param startIndex A index to indicate where to start search.
   * @returns Array of object that holds article title and article id.
   */
  async getMyDocs(startIndex?: number): Promise<Array<{ title: string; id: string }>> {
    if (startIndex === undefined) startIndex = 0;
    let currentIndex = (startIndex - 1) * this.docsPerPage;
    let res: QueryResponse = await this.httpClient
      .post<any>(this.getMyDocUrl, { userEmail: this.currentUser.email })
      .toPromise();
    let docIds: Array<string> = res.payload["docIds"].slice(currentIndex, currentIndex + this.docsPerPage);
    let titles: Array<string> = await this.articleService.convertDocIdsToTitles(docIds);
    let idIdx = 0;

    let idsAndTitles = titles.map((title) => {
      return { title: title, id: docIds[idIdx++] };
    });

    return idsAndTitles;
  }

  /**
   * @description Send query to delete all saved ariticles.
   * @returns Result of deleting operation.
   */
  async eraseAllMyDocs(): Promise<boolean> {
    let res = await this.httpClient
      .post<any>(this.deleteAllMyDocUrl, { userEmail: this.currentUser.email })
      .toPromise();
    return res.succ;
  }

  /**
   * @description Send query to get total number of saved articles.
   * @retursn Number of saved articles.
   */
  async getTotalDocNum(): Promise<number> {
    let res: QueryResponse = await this.httpClient
      .post<any>(this.getMyDocUrl, { userEmail: this.currentUser.email })
      .toPromise();

    return res.payload["docIds"].length;
  }
}
