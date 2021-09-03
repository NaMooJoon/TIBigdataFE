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
    private _isSelectedPreprocessed: boolean;
    
    constructor(
        private _middlewareService: AnalysisOnMiddlewareService,
        private _userSavedDocumentService: UserSavedDocumentService,
      ){};
      
    onMessage(event){
        let data = JSON.parse(event);
        this.email = data.email;

        let selectedKeyword = data.savedKeyword;
        let selectedSavedDate = data.savedDate;
        let isSelectedPreprocessed = data.isSelectedPreprocessed;
        // console.log('isPreprocessed?'+isSelectedPreprocessed);

        if(data.activity=='select')       this.setSelected(selectedKeyword, selectedSavedDate, isSelectedPreprocessed);
        else if(!isSelectedPreprocessed) return ;
        else if(data.activity=='preview') this.previewData(selectedKeyword,selectedSavedDate);
        else if(data.activity=='download') this.downloadData(selectedKeyword,selectedSavedDate);
        else ;
        
        }

    setSelected(selectedKeyword:string, selectedSavedDate:string, isSelectedPreprocessed: boolean){
        this.selectedKeyword=selectedKeyword;
        this.selectedSavedDate=selectedSavedDate;
        this.isSelectedPreprocessed = isSelectedPreprocessed;
    }

    previewData(selectedKeyword:string, selectedSavedDate:string){
        
    }
    
    downloadData(selectedKeyword:string, selectedSavedDate:string){
        
    }


    
LoadingWithMask() {
    //화면의 높이와 너비를 구합니다.
    let maskHeight = $(document).height();
    let maskWidth  = window.document.body.clientWidth;
    let gif='../../../../assets/icons/loading.gif';
     
    //화면에 출력할 마스크를 설정해줍니다.
    var mask       ="<div id='mask' style='position:absolute; z-index:9000; background-color:#000000; left:0; top:0; display:flex; justify-content: center; align-items: center;'></div>";
    var loadingImg = '';
      
    loadingImg +=" <img id='loading' src='"+ gif +"' style='position: absolute; margin: 0px auto;display: block;  '/>";
 
    

    //화면에 레이어 추가
    $('body')
        .append(mask)
 
    //마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채웁니다.
    $('#mask').css({
      // 'width':'100%',
      // 'height':'100vh',
            'width' : maskWidth,
            'height': maskHeight,
            'opacity' :'0.7'
    });
  
    //마스크 표시
    $('#mask').show();

    // var center       ="<div id='center' style='width: 100%; height: 100vh; display:flex; justify-content: center; align-items: center; '></div>";
    // $('body')
    //     .append(center)
    
    // $('#center').append(loadingImg);
    // $('#center').show();
    $('#mask')
    .append(loadingImg);
    //로딩중 이미지 표시
    // $('#loading').css({
    //   'opacity' :'1.0'
    // })


    $('#loading').append(loadingImg);
    $('#loading').show();
}
 
closeLoadingWithMask() {
    $('#mask, #loading').hide();
    $('#mask, #loading').empty(); 
}


    // async runMiddleware(activity: string, data: string):Promise<void>{
        
    //     if(this.selectedSavedDate==null) return alert('문서를 선택해주세요!');

    //     // let data = JSON.stringify({
    //     //     'userEmail': this.email, 
    //     //     'keyword': this.selectedKeyword, 
    //     //     'savedDate': this.selectedSavedDate,
    //     //     optionList: option,
    //     // });
        
    //     // console.log(data);
    //     let res = await this.middlewareService.postDataToMiddleware('/'+activity,data);
        

    //     // this.userSavedDocumentService.setMyDocPreprocessed(this.selectedSavedDate);
    //     // this.preprocessedData = res.result;
    //     // this.isDataPreprocessed = true;
    // }


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

    public get isSelectedPreprocessed(): boolean {
        return this._isSelectedPreprocessed;
    }
    public set isSelectedPreprocessed(value: boolean) {
        this._isSelectedPreprocessed = value;
    }


    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
}