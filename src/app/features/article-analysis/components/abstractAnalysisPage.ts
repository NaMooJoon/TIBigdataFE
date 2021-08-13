import { Injectable, OnInit } from "@angular/core";
import { AnalysisOnMiddlewareService } from "src/app/core/services/analysis-on-middleware-service/analysis.on.middleware.service";
import { UserSavedDocumentService } from "src/app/core/services/user-saved-document-service/user-saved-document.service";

@Injectable({
    providedIn: "root",
  })
  
export abstract class abstractAnalysis{
    

    private _email: string;
    private _selectedKeyword: string;
    private _selectedSavedDate: string;

    constructor(
        private _middlewareService: AnalysisOnMiddlewareService,
        private _userSavedDocumentService: UserSavedDocumentService,
      ){};
      
    onMessage(event){
        let data = JSON.parse(event);
        this.email = data.email;

        let selectedKeyword = data.keyword;
        let selectedSavedDate = data.savedDate;

        if(data.activity=='select')       this.setSelected(selectedKeyword, selectedSavedDate);
        else if(data.activity=='preview') this.previewData(selectedKeyword,selectedSavedDate);
        else if(data.activity=='download') this.downloadData(selectedKeyword,selectedSavedDate);
        else ;
        
        }

    setSelected(selectedKeyword:string, selectedSavedDate:string){
        this.selectedKeyword=selectedKeyword;
        this.selectedSavedDate=selectedSavedDate;
    }

    previewData(selectedKeyword:string, selectedSavedDate:string){
        
    }
    
    downloadData(selectedKeyword:string, selectedSavedDate:string){
        
    }

    async runMiddleware(activity: string, option: Object):Promise<void>{
        
        if(this.selectedSavedDate==null) return alert('문서를 선택해주세요!');

        let data = JSON.stringify({
            'userEmail': this.email, 
            'keyword': this.selectedKeyword, 
            'savedDate': this.selectedSavedDate,
            optionList: option,
        });
        
        console.log(data);
        // let res = await this.middlewareService.postDataToMiddleware('/'+activity,data);
        
        // this.userSavedDocumentService.setMyDocPreprocessed(this.selectedSavedDate);
        // this.preprocessedData = res.result;
        // this.isDataPreprocessed = true;
    }


    public get middlewareService(): AnalysisOnMiddlewareService {
        return this._middlewareService;
    }
    public set middlewareService(value: AnalysisOnMiddlewareService) {
        this._middlewareService = value;
    }
    public get userSavedDocumentService(): UserSavedDocumentService {
        return this._userSavedDocumentService;
    }
    public set userSavedDocumentService(value: UserSavedDocumentService) {
        this._userSavedDocumentService = value;
    }

    public get selectedKeyword(): string {
        return this._selectedKeyword;
    }
    public set selectedKeyword(value: string) {
        this._selectedKeyword = value;
    }

    public get selectedSavedDate(): string {
        return this._selectedSavedDate;
    }
    public set selectedSavedDate(value: string) {
        this._selectedSavedDate = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
}