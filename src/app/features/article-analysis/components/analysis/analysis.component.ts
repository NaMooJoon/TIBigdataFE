import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.less"],
})
export class AnalysisComponent implements OnInit  {
  email: any;
  selectedKeyword: any;
  selectedSavedDate: any;

  ngOnInit(): void {
  }

  onMessage(event){
    let data = JSON.parse(event);
    this.email = data.email;
    this.selectedKeyword = data.keyword;
    this.selectedSavedDate = data.savedDate;
  }

  showPop(analName:string){
    document.getElementById(analName).style.display='inline';
  }

  async runAnalysis(): Promise<void> {
    const http_req = new XMLHttpRequest();
    http_req.open("POST", "https://kubic.handong.edu:15000/textmining");
    http_req.setRequestHeader('Content-Type', 'application/json');

    

    var data = {
      userEmail:this.email, 
      keyword:this.selectedKeyword, 
      savedDate:this.selectedSavedDate,
      optionList: 100,
      analysisName: 'count',
    };

    
    http_req.send(JSON.stringify(data));
    // let data = http_req.responseText("result");
    http_req.onload = () => {

      if(http_req.status==200){
        console.log("응답:"+ JSON.parse(http_req.response));
        // this.preprocessedData = JSON.parse(http_req.responseText).result[0];
        // this.isDataPreprocessed =true;
      }
      else{
        console.log('flask not responsed');
        // this.isError=true;
        alert("내부적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요!");
      }
    }
  }

}
