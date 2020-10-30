import { Injectable } from '@angular/core';
import { IpService } from 'src/app/ip.service';
import { HttpClient } from "@angular/common/http";



@Injectable({
  providedIn: 'root'
})
export class CommunityServiceService {
  protected URL = this.ipService.get_FE_DB_ServerIp();
  private URL_LOAD_FIRST_DOC_LIST = this.URL + "/community/loadFirstDocList"; //mongoDB
  private URL_LOAD_NEXT_DOC_LIST = this.URL + "/community/loadNextDocList"; //mongoDB
  private URL_LOAD_PRIOR_DOC_LIST = this.URL + "/community/loadPriorDocList"; //mongoDB
  private URL_WRITE_NEW_DOC = this.URL + "/community/writeNewDoc"; //mongoDB
  private URL_GET_DOC_NUM = this.URL + "/community/getDocNum"; //mongoDB
  private URL_LOAD_LIST_BY_PAGE_IDX = this.URL + "/community/loadDocListByPageIdx"; //mongoDB
  private URL_SEARCH_DOC = this.URL + "/community/searchDoc"; //mongoDB
  private docList: {}[] = [];
  private idx: number = 0;
  private isDocListExist: boolean = true;
  private DOC_NUM_PER_EACH_PAGE = 10;
  // private chosen_idx : number = 0;
  private aDoc = {};
  constructor(protected ipService: IpService, private http: HttpClient,
  ) { }


  choseDoc(i : number){
    // this.chosen_idx = i;
    // this.
    this.aDoc["user"] = this.docList[i]["user"];
    this.aDoc["content"] = this.docList[i]["content"];
    this.aDoc["title"] = this.docList[i]["title"];

  }
  getChosenDoc(){
    return this.aDoc;
  }

  clearDocList() {
    this.docList = [];
  }

  /**
   * @description 한 페이지 당 몇개의 문서 보여줄 것인지?
   */
  getEachPageDocNum() {
    return this.DOC_NUM_PER_EACH_PAGE;
  }

  /**
   * @description 페이지 이동 후에 전체 게시글 DB에서 새로운 시작하는 게시글 인덱스 업데이트
   * @param new_idx 
   */
  updateStartIdx(new_idx) {
    this.idx = new_idx;
    // console.log("updated idx : " , this.idx)
  }

  async search(keyword : string){
    let res = await this.http.post<any>(this.URL_SEARCH_DOC, keyword).toPromise();
    // res.
  }

  /**
   * @description 페이지 이동 후 전체 게시글 DB에서 현재 시작하는 게시글 번호
   */
  getNewStartIDx() {
    return this.idx;
  }

  /**
   * pseudo code 
      number of docs per page ← N
      number of pages ← number of total docs / N
      if number of total docs % N > 0:
        then number of pages ++
      number of pages per bloc ← M
      number of bloc ← number of pages / M
      if number of pages % M > 0:
        then number of bloc ++

   * 
   * 
   */

  /**
   * 
   * @param res 
   * 처음에 numPagePerBloc만큼만 보여준다.
   * pageIdx % numPagePerBloc = 0이 되면 다음 bloc으로 이동. bloc idx update. bloc idx의 최대값은 numBloc이다.
   * pageIdx 의 최대값ㅂ은 numPage이다.
   * @return numPagePerBloc
   * @return numPage
   * @return numBloc
   */
  async pagingAlgo(){
    //number of docs per page ← N
    // use predefined this.DOC_NUM_PER_EACH_PAGE;
    //number of pages ← number of total docs / N
    let res = await this.getDocsNum();
    let numTotalDocs = res.payload.data;
    console.log("community service numTotalDocs : ", res.payload.data);

    let numPage = Math.floor(numTotalDocs / this.DOC_NUM_PER_EACH_PAGE);
    //if number of total docs % N > 0:
    if (numTotalDocs % this.DOC_NUM_PER_EACH_PAGE > 0)
    //  then number of pages ++
      numPage++;  
    //number of pages per bloc ← M
    // let numPagePerBloc = this.DOC_NUM_PER_EACH_PAGE;
    let numPagePerBloc = 10;
    //number of bloc ← number of pages / M
    let numBloc = Math.floor(numPage / numPagePerBloc);
    //if number of pages % M > 0:
    if(numPage % numPagePerBloc > 0)
    //  then number of bloc ++
      numBloc++;
    return { numPage : numPage, numPagePerBloc : numPagePerBloc, numBloc : numBloc};
  }

  async getDocsNum(){
    return await this.http.get<any>(this.URL_GET_DOC_NUM).toPromise();
  }


  /**
   * @description response 받은 Object에서 문서 제목 유저 내용 등을 추출해서 저장
   * @param res 
   */
  saveResponse(res){
    this.clearDocList();
    if (res.succ) {
      // console.log(res);
      var docs = res.payload.data;
      console.log("docs : ", docs)

      if(docs.length < this.DOC_NUM_PER_EACH_PAGE)
        this.DOC_NUM_PER_EACH_PAGE = (docs.length);

      for (var i = 0; i < docs.length; i++) {
        var doc = {};

        doc["user"] = docs[i].user;
        doc["title"] = docs[i].title;
        doc["content"] = docs[i].content;
        doc["id"] = docs[i].docId;
        this.docList.push(doc);
        this.isDocListExist = true;
        // console.log("service start idx : ", this.idx);
        // console.log("new service start idx : ", this.idx);
        
      }
      
      this.updateStartIdx(res.payload.next_start_idx);
      // console.log("Then what the hell is the next_start_idx? : ", res.payload.next_start_idx)
      // console.log("docList : ", this.docList);
    }
    if (this.docList.length == 0) {
      this.isDocListExist = false;
    }
    return this.docList;
  } 

  /**
   * @description 페이지 번호 눌러서 해당 페이지의 글들 로드하는 함수
   */
  async loadListByPageIdx(start_idx: number) {
    let body = { cur_start_idx: start_idx };

    let res = await this.http.post<any>(this.URL_LOAD_LIST_BY_PAGE_IDX,body).toPromise();
    return this.saveResponse(res);
  }

  
  /**
   * @description 가장 최근 게시판 글들 로드하는 함수
   */
  async loadFirstDocList() {
    let res = await this.http.get<any>(this.URL_LOAD_FIRST_DOC_LIST).toPromise();
    return this.saveResponse(res);
  }


  /**
   * @description 다음 페이지의 게시글들을 로드하는 함수
   * @param start_idx 
   */
  async loadNextDocList(start_idx: number) {
    // console.log("start idx : ", start_idx)
    let body = { cur_start_idx: start_idx };
    // console.log("comnunity service load next doc list : before send" )

    let res = await this.http.post<any>(this.URL_LOAD_NEXT_DOC_LIST, body).toPromise();
    return this.saveResponse(res);

  }



/**
 * @description 이전 페이지의 게시글들을 로드하는 함수
 * @param start_idx 
 */
  async loadPriorDocList(start_idx: number) {
    // console.log("start idx : ", start_idx)
    let body = { cur_start_idx: start_idx };
    // console.log("comnunity service load next doc list : before send" )

    let res = await this.http.post<any>(this.URL_LOAD_PRIOR_DOC_LIST, body).toPromise();
    return this.saveResponse(res);
  }


  /**
   * @description 새 게시글을 작성하는 함수
   * @param body 
   */
  async writeNewDoc(body: {}) {

    let res = await this.http.post<any>(this.URL_WRITE_NEW_DOC, body).toPromise();
    // console.log("community-service writeNewDoc : ", res);

    // alert("ok")
  }

  /**
   * @description 저장되어 있는 문서가 있는지 확인.
   */
  getIsDocListExist() {
    return this.isDocListExist;
  }

  /**
   * 
   * @param i : i번째 문서를 읽는다
   */
  navToReadThisDoc(i: number) {

  }

  /**
   * @function pressNextList
   * @description 다음 리스트의 커뮤니티 게시판을 요청하는 함수. FE 백엔드 서버에 요청.
   */
  pressNextList() {

  }

  /**
   * @description 이전 게시판 글 리스트를 요청하는 함수
   */
  pressPriorList() {

  }

  /**
   * @description 새 게시글을 저장한다.
   */
  saveNewDoc() {

  }


}
