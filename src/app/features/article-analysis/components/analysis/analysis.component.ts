import { Component, OnInit } from "@angular/core";
import { abstractAnalysis } from "../abstractAnalysisPage";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.less"],
})
export class AnalysisComponent extends abstractAnalysis implements OnInit  {

  private _isDataAnalysised: boolean = false;
  private _analysisedData: any;
  
  ngOnInit(): void {
  }

  showPop(analName:string){
    if(document.getElementById(analName).style.display=='inline')
      document.getElementById(analName).style.display='none'
    else
      document.getElementById(analName).style.display='inline';
  }

  async runAnalysis(activity:string): Promise<void>{
    if(this.selectedSavedDate==null) return alert('문서를 선택해주세요!');
    if(!this.isSelectedPreprocessed) return alert('선택하신 문서는 전처리되지 않은 문서입니다. 전처리를 먼저 해주세요!');
    let optionValue =  (<HTMLInputElement> document.getElementById(activity+'_option1')).value ;
    
    let data = JSON.stringify({
      'userEmail': this.email, 
      'keyword': this.selectedKeyword, 
      'savedDate': this.selectedSavedDate,

      'optionList': optionValue,
      'analysisName': activity,
    });
    
    // console.log(data);
    let res = await this.middlewareService.postDataToMiddleware('/textmining',data);
    
    this.analysisedData = res.result;
    this.isDataAnalysised = true;
  }


  public get isDataAnalysised(): boolean {
    return this._isDataAnalysised;
  }
  public set isDataAnalysised(value: boolean) {
    this._isDataAnalysised = value;
  }

  public get analysisedData(): any {
    return this._analysisedData;
  }
  public set analysisedData(value: any) {
    this._analysisedData = value;
  }
}
