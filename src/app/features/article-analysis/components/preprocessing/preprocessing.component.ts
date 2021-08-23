import { stringify } from "@angular/compiler/src/util";
import { Component, OnInit } from "@angular/core";
import { FileUploader } from 'ng2-file-upload';
import { abstractAnalysis } from "../abstractAnalysisPage";
import $ from 'jquery';

const URL = '/uploadDict';

@Component({
  selector: "app-preprocessing",
  templateUrl: "./preprocessing.component.html",
  styleUrls: ["./preprocessing.component.less"],
})

export class PreprocessingComponent extends abstractAnalysis implements OnInit {

  private _isDataPreprocessed: boolean = false;
  private _preprocessedData: Array<string>;

  //uploadDict
  // public uploader:FileUploader = new FileUploader({url: URL});
  // private _previewPreprocessed: boolean;

  ngOnInit(): void {
  }

  // async uploadDict(event:any){
  //   this.uploader.clearQueue();
  //   let files:File[] = event.target.files;
  //   let filteredFiles:File[] = [];
  //   for (var f of files) {
  //       if (f.name.endsWith(".csv")) {
  //           filteredFiles.push(f);
  //       }
  //   }

  //   if (filteredFiles.length == 0) {
  //     ;
  //     // this.showGuide = true;
  //   } else {
  //       // this.showGuide = false;
  //       let options = null;
  //       let filters = null;
  //       this.uploader.addToQueue(filteredFiles, options, filters);
  //   }

  //   function csvToJSON(csv_string){ // 1. 문자열을 줄바꿈으로 구분 => 배열에 저장 
  //     const rows = csv_string.split("\r\n"); // 줄바꿈을 \n으로만 구분해야하는 경우, 아래 코드 사용 
  //     // const rows = csv_string.split("\n"); // 2. 빈 배열 생성: CSV의 각 행을 담을 JSON 객체임 
  //     const jsonArray = []; // 3. 제목 행 추출 후, 콤마로 구분 => 배열에 저장 
  //     const header = rows[0].split(","); // 4. 내용 행 전체를 객체로 만들어, jsonArray에 담기 
  //     for(let i = 1; i < rows.length; i++){ // 빈 객체 생성: 각 내용 행을 객체로 만들어 담아둘 객체임 
  //       let obj = {}; // 각 내용 행을 콤마로 구분 
  //       let row = rows[i].split(","); // 각 내용행을 {제목1:내용1, 제목2:내용2, ...} 형태의 객체로 생성 
  //       for(let j=0; j < header.length; j++){ 
  //         obj[header[j]] = row[j]; 
  //       } // 각 내용 행의 객체를 jsonArray배열에 담기 
  //       jsonArray.push(obj); } 
  //       // 5. 완성된 JSON 객체 배열 반환 
  //       // return jsonArray; // 문자열 형태의 JSON으로 반환할 경우, 아래 코드 사용 
  //       return JSON.stringify(jsonArray); 
  //   }

  // }

//   setDisplay(){
//     if($('input:radio[id=synonym_user]').is(':checked')){
//         $('#selectUserDict').show();
//     }else{
//         $('#selectUserDict').hide();
//     }
// }


  async runPreprocessing():Promise<void>{
    let wordclass: number = 0;
    if(this.selectedSavedDate==null) return alert('문서를 선택해주세요!');

    let nodeList= <NodeListOf<HTMLInputElement>>document.getElementsByName('wordclass');
    nodeList.forEach((node) => {
      if(node.checked) wordclass += parseInt(node.value);
    });

    let data = JSON.stringify({
      'userEmail': this.email, 
      'keyword': this.selectedKeyword, 
      'savedDate': this.selectedSavedDate,
      
      'synonym': (<HTMLInputElement>document.getElementById('synonym_user')).checked,
      'stopword': (<HTMLInputElement>document.getElementById('stopword_user')).checked,
      'compound': (<HTMLInputElement>document.getElementById('compound_user')).checked,
      'wordclass': wordclass.toString() //(100) 동사, 010(명사), 001(형용사)
    });
    
    // console.log(data);
    let res = await this.middlewareService.postDataToMiddleware('/preprocessing',data);
    
    this.userSavedDocumentService.setMyDocPreprocessed(this.selectedSavedDate);
    this.preprocessedData = res.result;
    this.isDataPreprocessed = true;
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