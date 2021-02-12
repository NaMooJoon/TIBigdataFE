import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { AuthService } from '../membership/auth.service';
import { Res } from '../res.model';
import { DocumentService } from 'src/app/modules/homes/body/shared-services/document-service/document.service';
import { UserProfile } from '../membership/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserDocumentService {
  private API_URL: string = 'http://localhost:14000';
  private saveMyDocUrl = this.API_URL + "/myDoc/saveMyDoc";
  private getMyDocUrl = this.API_URL + "/myDoc/getMyDoc";
  private deleteAllMyDocUrl = this.API_URL + "/myDoc/deleteAllMyDocs";
  private currentUser: UserProfile;
  private docsPerPage: number = 10;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private documentService: DocumentService,
  ) {
    this.authService.getCurrentUserChange().subscribe(currentUser => {
      this.currentUser = currentUser;
      console.log(this.currentUser);
    })
  }

  async saveNewMyDoc(docIds: Array<string>): Promise<boolean> {
    let payload = { 'userEmail': this.currentUser.email, 'docIds': docIds };
    let res = await this.httpClient.post<any>(this.saveMyDocUrl, payload).toPromise()
    return res.succ;
  }

  async getMyDocs(startIndex?: number): Promise<Array<{ title: string, id: string, }>> {
    if (startIndex === undefined) startIndex = 0;
    let currentIndex = startIndex * this.docsPerPage;

    let res: Res = await this.httpClient.post<any>(this.getMyDocUrl, { 'userEmail': this.currentUser.email }).toPromise();
    let docIds: Array<string> = res.payload['docIds']

    let titles: Array<string> = await this.documentService.convertDocIdsToTitles(docIds.slice(currentIndex, currentIndex + this.docsPerPage));
    let idIdx = 0;

    let idsAndTitles = titles.map(title => {
      return { 'title': title, 'id': docIds[idIdx++] }
    });


    // async ngOnInit(): Promise<void> {
    // async 키워드 함수 앞에 붙여주고 안에서 호출 할 때는 await 키워드 붙여서 함수호출 해야함!
    //   console.log(await this.userDocumentService.getMyDocs());
    //   console.log(await this.userDocumentService.getMyDocs(1));
    //   console.log(await this.userDocumentService.getMyDocs(2));


    // }

    return idsAndTitles;
  }


  async eraseAllMyDocs(): Promise<boolean> {
    let res = await this.httpClient.post<any>(this.deleteAllMyDocUrl, { 'userEmail': this.currentUser.email }).toPromise()
    return res.succ;
  }
}
