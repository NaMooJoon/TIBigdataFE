import { Injectable, Injector } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { IpService } from 'src/app/ip.service'
import { DocumentService } from 'src/app/modules/homes/body/shared-services/document-service/document.service';

@Injectable({
  providedIn: 'root'
})
export class AnalysisDatabaseService {
  private URL = this.ipService.getFrontDBServerIp();

  private GET_KEYWORDS_URL = this.URL + "/keyword/getKeyVal";
  private GET_RCMD_URL = this.URL + "/rcmd/getRcmdTbl";
  private GET_TOPIC_URL = this.URL + "/topic/getTopicTbl";
  private GET_TOPIC_plain_URL = this.URL + "/topic/getTopicTblPlain";
  private GET_ONE_TOPIC_DOCS_URL = this.URL + "/topic/getOneTopicDocs";

  constructor(private ipService: IpService,
    private http: HttpClient,
    private docControl: DocumentService
  ) { }
  readonly DEBUG: boolean = false;

  debug(...arg: any[]) {
    if (this.DEBUG)
      console.log(arg);
  }
  /**
   * @description get requset to gain topic analysis LSTM table
   * @Param isPlain : if true, request plain text. without this, request pre-processed table.
   */
  async getTopicTable(isPlain?: boolean) {
    let url = this.GET_TOPIC_URL;
    if (isPlain)
      url = this.GET_TOPIC_plain_URL;
    let res = await this.http.get<any>(url).toPromise();
    return res
  }


  async getOneTopicDocs(tp: string) {
    let body = { topic: tp }
    console.log(body);
    let res = await this.http.post<any>(this.GET_ONE_TOPIC_DOCS_URL, body).toPromise();

    return res;
  }


  /**
    * @Param ids : id string array
    * @Param num : how many related documetns per each document? defualt = 5 if undefined.
    * @Param sim : if request cosine similarity of document
  */
  async getRelatedDocsTbl(ids: string | string[], num?: number, sim?: boolean) {
    this.debug("in db getRcmdTable, input ids : ", ids);
    let res = await this.http.post<any>(this.GET_RCMD_URL, { "id": ids, "num": num, "sim": sim }).toPromise()
    if (res.succ) {
      console.log("res: ", res);
      // this.debug("in db rcmdTable : ",res);
      return res.payload;
    }
  }

  /**
    * @Param ids : id string array
    * @Param num : how many related documetns per each document? defualt = 5 if undefined.
    * @Param isVal : if true, get the value of tfidf data as well.
    * @returns return : [
  { _id: 5ed0cabae859f4127006b78f, tfidf: [ '증강', '탐지', '군사력' ] },       
  { _id: 5ed0cabae859f4127006b759, tfidf: [ '도시', '지구', '천지' ] }
]
  */
  async getTfidfVal(ids: string | string[], num?: number, isVal?: boolean) {
    return new Promise(resolve => {
      this.http.post<any>(this.GET_KEYWORDS_URL, { "id": ids, "num": num, "isVal": isVal }).subscribe(
        res => {
          this.debug(res)
          resolve(res);
        },
        err => this.debug(err),
      )
    })
  }

  /**
   * @description 문서 id을 받아서 연관문서 array을 반환
   * @param id document id
   * @returns [ {id : 12345, "title" : 연관문서 제목 1},...]
   */
  async loadRelatedDocs(id: string) {
    let _rcmdIdsRes = await this.getRelatedDocsTbl(id)
    this.debug("in db : getRelatedDocs : rcmd response id list:", _rcmdIdsRes)
    let rcmdIds = _rcmdIdsRes[0]["rcmd"];
    let _titlesRes = await this.docControl.convert_id_to_doc_title(rcmdIds as string[])
    this.debug("in db : rcmdRes:", _titlesRes)

    let titles = _titlesRes as []

    let i = -1;
    let relatedDocs = titles.map(t => {
      i++;
      return { "id": rcmdIds[i], "title": t };
    })

    this.debug("relatedDocs:", relatedDocs);
    return relatedDocs;
  }

}
