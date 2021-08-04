import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { PaginationModel } from "src/app/core/models/pagination.model";
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service";
import { UserSavedDocumentService } from 'src/app/core/services/user-saved-document-service/user-saved-document.service';
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { MyDocsComponent } from "src/app/features/userpage/components/my-docs/my-docs.component";
import { MydocModel } from "src/app/core/models/mydoc.model";
import { UserProfile } from "src/app/core/models/user.model";
import { FileUploader } from 'ng2-file-upload';

const URL = '/uploadDict';

@Component({
  selector: "app-preprocessing",
  templateUrl: "./preprocessing.component.html",
  styleUrls: ["./preprocessing.component.less"],
})

export class PreprocessingComponent implements OnInit {

  private _savedDocs: Array<MydocModel>;

  private _isSavedDocsLoaded: boolean = false;
  private _isSavedDocsEmpty: boolean;
  private _totalSavedDocsNum: number;
  private _totalSavedKeywordsNum: number;
  
  private _userProfile: UserProfile;

  private _isDataPreprocessed: boolean = false;
  private _preprocessedData: Array<string>;

  //uploadDict
  public uploader:FileUploader = new FileUploader({url: URL});

  constructor(
    private userSavedDocumentService: UserSavedDocumentService,
    private articleService: ArticleService,
    private router: Router,
    private authenticationService: AuthenticationService,
    )   {
      this.authenticationService.getCurrentUserChange().subscribe((currentUser) => {
      this.userProfile = currentUser;
    });
  }

  ngOnInit(): void {
    this.loadSavedDocs();
  }

  
  /**
   * @description Load saved documents from userSavedDocumentService
   * @param pageNum
   */
  async loadSavedDocs(): Promise<void> {
    
    // this.isSavedDocsLoaded = false;
    // this.totalSavedDocsNum = await this.userSavedDocumentService.getTotalDocNum(this.keyword, this.savedDate);
    // this.isSavedDocsEmpty = (this.totalSavedDocsNum === 0);
    // if (this.isSavedDocsEmpty) return;

    this.savedDocs = await this.userSavedDocumentService.getAllMyDocs();
    // this.setCheckbox();
    this.isSavedDocsLoaded = true;
    }

  async uploadDict(event:any){
    this.uploader.clearQueue();
    let files:File[] = event.target.files;
    let filteredFiles:File[] = [];
    for (var f of files) {
        if (f.name.endsWith(".csv")) {
            filteredFiles.push(f);
        }
    }

    if (filteredFiles.length == 0) {
      ;
      // this.showGuide = true;
    } else {
        // this.showGuide = false;
        let options = null;
        let filters = null;
        this.uploader.addToQueue(filteredFiles, options, filters);
    }

    function csvToJSON(csv_string){ // 1. 문자열을 줄바꿈으로 구분 => 배열에 저장 
      const rows = csv_string.split("\r\n"); // 줄바꿈을 \n으로만 구분해야하는 경우, 아래 코드 사용 
      // const rows = csv_string.split("\n"); // 2. 빈 배열 생성: CSV의 각 행을 담을 JSON 객체임 
      const jsonArray = []; // 3. 제목 행 추출 후, 콤마로 구분 => 배열에 저장 
      const header = rows[0].split(","); // 4. 내용 행 전체를 객체로 만들어, jsonArray에 담기 
      for(let i = 1; i < rows.length; i++){ // 빈 객체 생성: 각 내용 행을 객체로 만들어 담아둘 객체임 
        let obj = {}; // 각 내용 행을 콤마로 구분 
        let row = rows[i].split(","); // 각 내용행을 {제목1:내용1, 제목2:내용2, ...} 형태의 객체로 생성 
        for(let j=0; j < header.length; j++){ 
          obj[header[j]] = row[j]; 
        } // 각 내용 행의 객체를 jsonArray배열에 담기 
        jsonArray.push(obj); } 
        // 5. 완성된 JSON 객체 배열 반환 
        // return jsonArray; // 문자열 형태의 JSON으로 반환할 경우, 아래 코드 사용 
        return JSON.stringify(jsonArray); 
    }

  }

  async toMiddleWare(){
    const http_req = new XMLHttpRequest();
    http_req.open("POST", "https://kubic.handong.edu:15000/preprocessing");
    http_req.setRequestHeader('Content-Type', 'application/json');

    var data = {
      userEmail:this.userProfile.email, 
      keyword:"북한", 
      savedDate:"2021-07-08T11:46:03.973Z",
      synonym: true,
      stopword: true,
      compound: true,
      wordclass: "010" //(100) 동사, 010(명사), 001(형용사)
    };

    http_req.send(JSON.stringify(data));
    // let data = http_req.responseText("result");
    http_req.onload = () => {
      console.log("응답:"+ JSON.parse(http_req.responseText).result[0].slice(0,50));
      this.preprocessedData = JSON.parse(http_req.responseText).result[0].slice(0,50);
      // console.log("Flask 서버로부터의 응답은: " + http_req.responseText);
      this.isDataPreprocessed =true;
    }
    // if(http_req.status==200)
  //   $(function () {
  //   var data = {userEmail:"sujinyang@handong.edu", keyword:"북한", savedDate:"2021-07-08T11:46:03.973Z"};
  //   $.ajax({
  //       type: "POST",
  //       data :JSON.stringify(data),
  //       url: "http://kubic.handong.edu:15000/preprocessing",
  //       contentType: "application/json",
        
  //   });
  // });
  }

  previewPreprocessedData(){
    document.getElementById("pop").style.display='inline';
    // var url = "popup.html";
    // var name = "preview data";
    // var option = "width = 500, height = 500, top = 100, left = 200, location = no, scrollbars=yes";
    // window.open(url, name, option);
  }

  public get savedDocs(): Array<MydocModel> {
    return this._savedDocs;
  }
  public set savedDocs(value: Array<MydocModel>) {
    this._savedDocs = value;
  }

  public get isSavedDocsLoaded() {
    return this._isSavedDocsLoaded;
  }
  public set isSavedDocsLoaded(value) {
    this._isSavedDocsLoaded = value;
  }

  public get isSavedDocsEmpty() {
    return this._isSavedDocsEmpty;
  }
  public set isSavedDocsEmpty(value) {
    this._isSavedDocsEmpty = value;
  }
  
  
  public get userProfile(): UserProfile {
    return this._userProfile;
  }
  public set userProfile(value: UserProfile) {
    this._userProfile = value;
  }
  
  public get isDataPreprocessed() {
    return this._isDataPreprocessed;
  }
  public set isDataPreprocessed(value) {
    this._isDataPreprocessed = value;
  }

  
  public get preprocessedData(){
    return this._preprocessedData;
  }

  public set preprocessedData(value){
    this._preprocessedData = value;
  }
}