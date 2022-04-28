import { Component, OnInit, Output } from "@angular/core";
import { abstractAnalysis } from "../abstractAnalysisPage";
import * as d3 from 'd3';

@Component({
  selector: "app-preprocessing",
  templateUrl: "./preprocessing.component.html",
  styleUrls: ["../../analysis-style.less"],
})

export class PreprocessingComponent extends abstractAnalysis implements OnInit {

  private _preprocessedData: Array<string>;
  private _isSynonymEmpty : boolean;
  private _isCompoundEmpty : boolean;
  private _isStopwordEmpty : boolean;

  private _userDictInfo : any;
  // private _uploadedDict: Object;
  // private _previewPreprocessed: boolean;

  ngOnInit(): void {
    this.getUserDictInfo();
  }

  async getUserDictInfo() : Promise<void>{
    let data = JSON.stringify({
      'userEmail' : this.email,
    });
    this.userDictInfo = await this.middlewareService.postDataToFEDB('/textMining/findDict', data);

    if(this.userDictInfo.synonym.length != 0)
      this.isSynonymEmpty = false;
    else
      this.isSynonymEmpty = true;

    if(this.userDictInfo.stopword.length != 0)
      this.isStopwordEmpty = false;
    else
      this.isStopwordEmpty = true;

    if(this.userDictInfo.compound.length != 0)
      this.isCompoundEmpty = false;
    else
      this.isCompoundEmpty = true;    
  }
  // uploadDict(dictType:string){
  //   this.insertDictToDB(dictType);
  // }
/**
 * @description open text file 
 * @param dictType 
 */
  async openTextFile(dictType:string){
  
    let isUserDictEmpty : boolean;
    let dict : string;
    if(dictType == 'synonym'){
      isUserDictEmpty = this.isSynonymEmpty;
      dict = "유의어";
    }
    else if(dictType == 'stopword'){
      isUserDictEmpty = this.isStopwordEmpty;
      dict = "불용어";
    }
    else if(dictType == 'compound'){
      isUserDictEmpty = this.isCompoundEmpty;
      dict = "복합어";
    }

    if(!isUserDictEmpty){
      let uploadConfirm = confirm("이미 내 " + dict + " 사전이 존재합니다. 다시 업로드 하시겠습니까?");
      if(uploadConfirm){
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
        }
      }else{
        let tag = dictType + "_basic";
        document.getElementById(tag).click();
      }
    };
  }

  /**
   * @description process the file to upload to MongoDB
   */
  async processFile(file:File, dictType:string){
    // console.log('csv->json');
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
      // console.log(data);
      this.middlewareService.postDataToFEDB('/textmining/uploadDict', data);
      alert('사전 업로드가 완료되었습니다.');
        // return jsonArray;
        // this.uploadedDict = jsonArray;
        // console.log("uploadedDict",this.uploadedDict);
      if(dictType == 'synonym')
        this.isSynonymEmpty = false;
      else if(dictType == 'stopword')
        this.isStopwordEmpty = false;
      else if(dictType == 'compound')
        this.isCompoundEmpty = false;
    };
  }

  /**
   * 
   * @description run preprocessing
   */
  async runPreprocessing():Promise<void>{
    let wordclass: number = 0;
    if(this.selectedSavedDate==null) return alert('문서를 선택해주세요!');
    if(this.isSelectedPreprocessed)  if(!confirm('선택하신 문서는 이미 전처리된 문서입니다. 새로 전처리하시겠습니까?')) return ;

    let nodeList= <NodeListOf<HTMLInputElement>>document.getElementsByName('wordclass');
    nodeList.forEach((node) => {
      if(node.checked) wordclass += parseInt(node.value);
    });

    if(wordclass==0) return alert("품사를 한 개 이상 선택해주세요!");

    this.LoadingWithMask();
    document.getElementById("cancelbtn").addEventListener("click", this.closeLoadingWithMask);

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
    if(res.returnCode!=200){
      alert(res.errMsg);
      this.closeLoadingWithMask();
      return ;
    };

    this.userSavedDocumentService.setMyDocPreprocessed(this.selectedSavedDate);
    this.preprocessedData = res.result;
    
    this.isDataPreview = false;
    this.isDataPreprocessed = true;

    this.closeLoadingWithMask();
    console.log("preview", this.preprocessedData);
    this.clearResult();
    this.drawPreTable(this.preprocessedData, "runProcessing");
    alert("전처리 완료되었습니다");
  }

  async previewDict(dictType : string) : Promise<void>{
    let userDict = $('input[name="synonym"]:checked').val();  

    if(dictType =='synonym')
      userDict = $('input[name="synonym"]:checked').val(); 
    else if(dictType == 'stopword')
      userDict = $('input[name="stopword"]:checked').val(); 
    else if(dictType == 'compound')
      userDict = $('input[name="compound"]:checked').val(); 

    let data : string;
    if(userDict == 'basic'){
      data = JSON.stringify({
        'userEmail': 'default',
      })
    }
    else if(userDict == 'user'){
      data = JSON.stringify({
        'userEmail' : this.email,
      })
    }

    let res = await this.middlewareService.postDataToFEDB('/textMining/findDict', data);
    console.log(res);
    this.showDictData(dictType, res);    
  }
  
  showDictData( dictType: string, data : any ){
    d3.selectAll('figure > *').remove();
    let text : string;
    if(data.userEmail == 'default'){
      text = "기본 사전: ";
      if(dictType == 'synonym')
        text += "유의어";
      else if(dictType == 'stopword')
        text += "불용어";
      else if(dictType == 'compound')
        text += "복합어";
    }else{
      text = "내 사전: ";
      if(dictType == 'synonym')
        text += "유의어";
      else if(dictType == 'stopword')
        text += "불용어";
      else if(dictType == 'compound')
        text += "복합어";
    }

    let obj = document.getElementById("table");
    let title = document.createElement("strong");
    title.innerHTML = text;
    obj.appendChild(title);

    const table = d3.select("figure#table")
      .attr('class','result-pretable')
      .append("table")
      .attr('width','100%')
      .attr('height','200px')
    
    const th = table.append("tr")
        .style('padding','15px 0px')
        .style('font-weight','500')
        .style('text-align','center');

    if(dictType == 'synonym'){
      let keys = Object.keys(data.synonym);
     
      th.append('th').text('NO');
      th.append('th').text('대표어');
      th.append('th').text('유의어');

      const tbody = table.append("tbody")
        .style('text-align', 'center')

        for(let i=0;i<keys.length;i++){
          const tr = tbody.append("tr");
          tr.append("td").text(i+1);
          tr.append("td").text(keys[i]);
          tr.append("td").text(data.synonym[keys[i]]);
        }
    }else if(dictType == 'stopword'){
      let keys = Object.keys(data.stopword);
      
      th.append('th').text('NO');
      th.append('th').text('불용어');

      const tbody = table.append("tbody")
        .style('text-align', 'center')

        for(let i=0;i<keys.length;i++){
          const tr = tbody.append("tr");
          tr.append("td").text(i+1);
          tr.append("td").text(keys[i]);
        }
    }else if(dictType == 'compound'){
      let keys = Object.keys(data.compound);
       
      th.append('th').text('NO');
      th.append('th').text('복합어');
      th.append('th').text('해당 품사');


      const tbody = table.append("tbody")
        .style('text-align', 'center')

        for(let i=0;i<keys.length;i++){
          const tr = tbody.append("tr");
          tr.append("td").text(i+1);
          tr.append("td").text(keys[i]);
          tr.append("td").text(data.compound[keys[i]]);
        }
      }
  }
  /*
  showDictData( dictType: string, data : any ){
    d3.selectAll('figure > *').remove();

    const table = d3.select("figure#table")
      .attr('class','result-pretable')
      .append("table")
      .attr('width','100%')
      .attr('height','200px');
    
    if(dictType == 'synonym'){
      let keys = Object.keys(data.synonym);
      table.text("사용자 사전: 유의어").attr('bold')
      const th = table.append("tr")
        .style('padding','15px 0px')
        .style('font-weight','500')
        .style('text-align','center')
        .style('color', '#fff')
        .style('background', 'lightskyblue');
      
      th.append('th').text('NO');
      th.append('th').text('대표어');
      th.append('th').text('유의어');

      const tbody = table.append("tbody")
        .style('text-align', 'center')

        for(let i=0;i<keys.length;i++){
          const tr = tbody.append("tr");
          tr.append("td").text(i+1);
          tr.append("td").text(keys[i]);
          tr.append("td").text(data.synonym[keys[i]]);
        }
    }else if(dictType == 'stopword'){
      let keys = Object.keys(data.stopword);
      table.text("사용자 사전: 불용어").attr('bold');
      const th = table.append("tr")
      .style('padding','15px 0px')
      .style('font-weight','500')
      .style('text-align','center')
      .style('color', '#fff')
      .style('background', 'lightskyblue')
      
      th.append('th').text('NO');
      th.append('th').text('불용어');

      const tbody = table.append("tbody")
        .style('text-align', 'center')

        for(let i=0;i<keys.length;i++){
          const tr = tbody.append("tr");
          tr.append("td").text(i+1);
          tr.append("td").text(keys[i]);
        }
    }else if(dictType == 'compound'){
      let keys = Object.keys(data.compound);
      table.text("사용자 사전: 복합어").attr('bold');
      const th = table.append("tr")
      .style('padding','15px 0px')
      .style('font-weight','500')
      .style('text-align','center')
      .style('color', '#fff')
      .style('background', 'lightskyblue')
      
      th.append('th').text('NO');
      th.append('th').text('복합어');
      th.append('th').text('해당 품사');


      const tbody = table.append("tbody")
        .style('text-align', 'center')

        for(let i=0;i<keys.length;i++){
          const tr = tbody.append("tr");
          tr.append("td").text(i+1);
          tr.append("td").text(keys[i]);
          tr.append("td").text(data.compound[keys[i]]);
        }
      }
  }
  */

  public get preprocessedData(){
    return this._preprocessedData;
  }

  public set preprocessedData(value){
    this._preprocessedData = value;
  }

  public get userDictInfo() : any{
    return this._userDictInfo;
  }
  public set userDictInfo(value : any){
    this._userDictInfo = value;
  }

  public get isSynonymEmpty() : boolean{
    return this._isSynonymEmpty;
  }
  public set isSynonymEmpty(value : boolean){
    this._isSynonymEmpty = value;
  }

  public get isStopwordEmpty() : boolean{
    return this._isStopwordEmpty;
  }
  public set isStopwordEmpty(value : boolean){
    this._isStopwordEmpty = value;
  }

  public get isCompoundEmpty() : boolean{
    return this._isCompoundEmpty;
  }
  public set isCompoundEmpty(value : boolean){
    this._isCompoundEmpty = value;
  }
}