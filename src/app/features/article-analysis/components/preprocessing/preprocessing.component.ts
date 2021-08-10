import { Component, OnInit } from "@angular/core";
import { FileUploader } from 'ng2-file-upload';
import { AnalysisOnMiddlewareService } from 'src/app/core/services/analysis-on-middleware-service/analysis.on.middleware.service'
const URL = '/uploadDict';

@Component({
  selector: "app-preprocessing",
  templateUrl: "./preprocessing.component.html",
  styleUrls: ["./preprocessing.component.less"],
})

export class PreprocessingComponent implements OnInit {

  private _isDataPreprocessed=false;
  private _preprocessedData: Array<string>;

  //uploadDict
  public uploader:FileUploader = new FileUploader({url: URL});
  private _previewPreprocessed: boolean;
  private _isError: boolean;
  selectedKeyword: string;
  selectedSavedDate: string;
  email: string;
  
  constructor(
    private middlewareService: AnalysisOnMiddlewareService
  ){};

  ngOnInit(): void {
    // this.loadSavedDocs();
    // this.isDataPreprocessed=Array[4];
    this.previewPreprocessed = false;
  }

  onMessage(event){
    let data = JSON.parse(event);
    this.email = data.email;
    this.selectedKeyword = data.keyword;
    this.selectedSavedDate = data.savedDate;
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

  async runPreprocessing(idx:number):Promise<void>{
    let data = JSON.stringify({
      userEmail: this.email, 
      keyword: this.selectedKeyword, 
      savedDate: this.selectedSavedDate,
      synonym: false,
      stopword: false,
      compound: false,
      wordclass: "010" //(100) 동사, 010(명사), 001(형용사)
    });
    
    console.log(data);
    let res = await this.middlewareService.postDataToMiddleware('/preprocessing',data);
    
    this.preprocessedData = res.result;
    this.isDataPreprocessed = true;
    // if(res.isSuccess) this.isDataPreprocessed = true;

    // http_req.send(JSON.stringify(data));
    // // let data = http_req.responseText("result");
    // http_req.onload = () => {

    //   if(http_req.status==200){
    //     console.log("응답:"+ JSON.parse(http_req.responseText).result);
    //     this.preprocessedData = JSON.parse(http_req.responseText).result;
    //     this.isDataPreprocessed =true;
    //   }
    //   else{
    //     console.log('flask not responsed');
    //     this.isError=true;
    //     alert("내부적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요!");
    //   }
    //   // console.log("Flask 서버로부터의 응답은: " + http_req.responseText);
    
    // }
  }

  previewPreprocessedData(){
    this.previewPreprocessed = true;
    document.getElementById("pop").style.display='inline';
    // var url = "popup.html";
    // var name = "preview data";
    // var option = "width = 500, height = 500, top = 100, left = 200, location = no, scrollbars=yes";
    // window.open(url, name, option);
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

  public get previewPreprocessed(): boolean {
    return this._previewPreprocessed;
  }
  public set previewPreprocessed(value: boolean) {
    this._previewPreprocessed = value;
  }

  public get isError(): boolean {
    return this._isError;
  }
  public set isError(value: boolean) {
    this._isError = value;
  }
}