import { Component, OnInit } from "@angular/core";
import { AnalysisOnMiddlewareService } from "src/app/core/services/analysis-on-middleware-service/analysis.on.middleware.service";

@Component({
  selector: "app-analysis",
  templateUrl: "./analysis.component.html",
  styleUrls: ["./analysis.component.less"],
})
export class AnalysisComponent implements OnInit  {
  email: any;
  selectedKeyword: any;
  selectedSavedDate: any;
  isDataAnalysised: boolean;
  AnalysisResult: any;

  constructor(
    private middlewareService: AnalysisOnMiddlewareService
  ){};

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

  async runAnalysisCount(): Promise<void> {

    let optionValue = (<HTMLInputElement> document.getElementById('count_option1')).value ;

    let data = JSON.stringify({
      'userEmail': this.email, 
      'keyword': this.selectedKeyword, 
      'savedDate': this.selectedSavedDate,
      'optionList': optionValue,
      'analysisName': 'count',
    });
    
    console.log(data);
    let res = await this.middlewareService.postDataToMiddleware('/textmining',data);
    
    this.AnalysisResult = res.result;
    this.isDataAnalysised = true;
    
  }

  async runAnalysisTfidf(): Promise<void> {

    let optionValue = (<HTMLInputElement> document.getElementById('tfidf_option1')).value ;

    let data = JSON.stringify({
      'userEmail': this.email, 
      'keyword': this.selectedKeyword, 
      'savedDate': this.selectedSavedDate,
      'optionList': optionValue,
      'analysisName': 'tfidf',
    });
    
    console.log(data);
    let res = await this.middlewareService.postDataToMiddleware('/textmining',data);
    
    this.AnalysisResult = res.result;
    this.isDataAnalysised = true;
    
  }


  async runAnalysisNetwork(): Promise<void> {

    let optionValue = (<HTMLInputElement> document.getElementById('network_option1')).value ;

    let data = JSON.stringify({
      'userEmail': this.email, 
      'keyword': this.selectedKeyword, 
      'savedDate': this.selectedSavedDate,
      'optionList': optionValue,
      'analysisName': 'network',
    });
    
    console.log(data);
    let res = await this.middlewareService.postDataToMiddleware('/textmining',data);
    
    this.AnalysisResult = res.result;
    this.isDataAnalysised = true;
    
  }


}
