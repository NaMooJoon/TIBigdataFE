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
  private API_URL: string = 'http://localhost:4000';
  private KEEP_MY_DOC_URL = this.API_URL + "/myDoc/keepMyDoc";
  private GET_MY_DOC_URL = this.API_URL + "/myDoc/getMyDoc";
  private ERASE_ALL_MY_DOC = this.API_URL + "/myDoc/eraseAllDoc";
  private currentUser: UserProfile;

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private documentService: DocumentService,
  ) {
    this.authService.getCurrentUserChange().subscribe(currentUser => {
      this.currentUser = currentUser;
    })
  }

  async saveNewDoc(docIds: Array<string>): Promise<boolean> {
    let idRes: Res = await this.httpClient.post<any>(this.GET_MY_DOC_URL, { payload: this.currentUser.email }).toPromise();
    if (!idRes.succ) {
      let payload = { userEmail: this.currentUser.email, docs: docIds };
      let res = await this.httpClient.post<any>(this.KEEP_MY_DOC_URL, payload).toPromise()

      return res.succ;
    }
  }

  async getMyDocs(): Promise<Array<{ title: string, id: string }>> {
    let res: Res = await this.httpClient.post<any>(this.GET_MY_DOC_URL, { payload: this.currentUser.email }).toPromise();
    let docIds: Array<string> = res.payload as Array<string>;

    let titles: Array<string> = await this.documentService.convert_id_to_doc_title(docIds);
    let idIdx = 0;

    return titles.map(title => {
      return { 'title': title, 'id': docIds[idIdx++] }
    });
  }


  eraseAllMyDoc(): boolean {
    return false;
  }
}
