import { stringify } from "@angular/compiler/src/util";
import { Component, OnInit, Output } from "@angular/core";
import { abstractAnalysis } from "../abstractAnalysisPage";
import $ from 'jquery';
import * as d3 from 'd3';

@Component({
  selector: "app-preprocessing",
  templateUrl: "./preprocessing.component.html",
  styleUrls: ["./preprocessing.component.less"],
})

export class PreprocessingComponent extends abstractAnalysis implements OnInit {

  private _isDataPreprocessed: boolean = false;
  private _preprocessedData: Array<string>;
  uploadedDict: Object;
  // private _previewPreprocessed: boolean;

  ngOnInit(): void {
  }

  // uploadDict(dictType:string){
  //   this.insertDictToDB(dictType);
  // }

  openTextFile(dictType:string){
    console.log('opened csv file');
    let input = document.createElement("input");

    input.type = "file";
    input.accept =".csv";

    input.click();
    input.onchange= (event:Event) => {
      
      let target = <HTMLInputElement> event.target;
      // console.log(target.files);
      // if(target.files.length==0) 
      //   return alert('사전이 업로드되지 않았습니다.');
      // console.log("fileUpload:"+(event.target).files[0].name);
      this.processFile(target.files[0],dictType);
      // return this.uploadedDict;
    };
  }

  async processFile(file:File, dictType:string){
    console.log('csv->json');
    let reader = new FileReader();
    let csv_string: string;
    reader.readAsText(file, "UTF-8");

    // console.log("성공?"+reader.error);

    reader.onload= ()=> {
      csv_string = <string> reader.result;
      // console.log("csvfile:"+csv_string);
      const rows = csv_string.split("\r\n"); 
      let jsonArray = {};
      for(let i = 0; i < rows.length; i++){ 
        let words = rows[i].split(",");
        let header = words.shift();
        jsonArray[header]= words;
      } 
        
      let data = JSON.stringify({
        'userEmail': this.email,
        'dictType': dictType,
        'csv': jsonArray,
      });
      console.log(data);
      this.middlewareService.postDataToFEDB('/usersDict/uploadDict', data);
      alert('사전 업로드가 완료되었습니다.');
        // return jsonArray;
        // this.uploadedDict = jsonArray;
        // console.log("uploadedDict",this.uploadedDict);
    };
  }

  // insertDictToDB(dictType:string){
  //   console.log('reading..');
  //   let csv = this.openTextFile();
  //   console.log('reading done',csv);
  // }

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

  //   function csvToJSON(file: File){
  //     // loadDataFile (파일 : 파일) : void {
  //       const fileReader = new FileReader();
  //       fileReader.onload = e =>{
  //         file.text
  //       };
  //       fileReader.readAsText (파일 이름);
  //   }
      
      
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

    this.LoadingWithMask();

    let data = JSON.stringify({
      'userEmail': this.email, 
      'keyword': this.selectedKeyword, 
      'savedDate': this.selectedSavedDate,
      
      'synonym': (<HTMLInputElement>document.getElementById('synonym_user')).checked,
      'stopword': (<HTMLInputElement>document.getElementById('stopword_user')).checked,
      'compound': (<HTMLInputElement>document.getElementById('compound_user')).checked,
      'wordclass': wordclass.toString().padStart(3, '0') //(100) 동사, 010(명사), 001(형용사)
    });
    
    // console.log(data);
    let res = await this.middlewareService.postDataToMiddleware('/preprocessing',data);
    
    this.userSavedDocumentService.setMyDocPreprocessed(this.selectedSavedDate);
    this.preprocessedData = res.result;
    this.isDataPreprocessed = true;
    this.drawTable();
    this.closeLoadingWithMask();

    alert("전처리 완료되었습니다");
  }

  drawTable(){
    let data:Array<string> = this.preprocessedData;
    const table = d3.select("figure#table").append("table").style('width','100%');

      const th = table.append("tr")
      .style('padding','15px 0px')
      .style('font-weight','500')
      .style('text-align','center');
      
      th.append('th').text('No');
      th.append('th').text('단어');

      const tbody = table.append("tbody")
      .style('text-align','center');

      for(let i=0;i<data.length;i++){
        const tr = tbody.append("tr");
        tr.append("td").text(i+1);
        tr.append("td").text(data[i]);
      }
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