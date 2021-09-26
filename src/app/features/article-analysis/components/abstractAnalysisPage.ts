import { Directive, Injectable, OnInit } from "@angular/core";
import * as d3 from 'd3';
import { AnalysisOnMiddlewareService } from "src/app/core/services/analysis-on-middleware-service/analysis.on.middleware.service";
import { UserSavedDocumentService } from "src/app/core/services/user-saved-document-service/user-saved-document.service";

@Injectable({
    providedIn: "root",
  })

@Directive({
    selector: '[appChanges]'
})
  
  
export abstract class abstractAnalysis{

    private _email: string;
    private _selectedKeyword: string;
    private _selectedSavedDate: string;
    private _isSelectedPreprocessed: boolean;
    private _isDataPreprocessed: boolean = false;
    private _isDataPreview: boolean = false;
    
    
    constructor(
        private _middlewareService: AnalysisOnMiddlewareService,
        private _userSavedDocumentService: UserSavedDocumentService,
      ){};
      
    onMessage(event){
        let data = JSON.parse(event);
        this.email = data.email;

        console.log(event);
        let selectedKeyword = data.savedKeyword;
        let selectedSavedDate = data.savedDate;
        let isSelectedPreprocessed = data.isSelectedPreprocessed;
        // console.log('isPreprocessed?'+isSelectedPreprocessed);

        if(data.activity=='select')       this.setSelected(selectedKeyword, selectedSavedDate, isSelectedPreprocessed);
        // else if(!isSelectedPreprocessed) return ;
        else if(data.activity=='preview') this.previewData(selectedKeyword,selectedSavedDate);
        else if(data.activity=='download') this.downloadData(selectedKeyword,selectedSavedDate);
        else ;
        
        }

    setSelected(selectedKeyword:string, selectedSavedDate:string, isSelectedPreprocessed: boolean){
        this.selectedKeyword=selectedKeyword;
        this.selectedSavedDate=selectedSavedDate;
        this.isSelectedPreprocessed = isSelectedPreprocessed;
    }

    async previewData(selectedKeyword:string, selectedSavedDate:string){
        let data = JSON.stringify({
            'userEmail': this.email,
            'keyword': selectedKeyword,
            'savedDate': selectedSavedDate,
          });
        
        this.LoadingWithMask();

        let result = await this.middlewareService.postDataToFEDB('/textmining/getPreprocessedData', data);
        console.log("preview", result);
        
        this.clearResult();
        this.drawPreTable(result, "preview");
        
        this.isDataPreprocessed = false;
        this.isDataPreview =true;
        this.closeLoadingWithMask();
    }
    
    downloadData(selectedKeyword:string, selectedSavedDate:string){
        
    }

    drawPreTable(dataArray:any, activity: string){
        let data:Array<string>;

        const figure = d3.select("figure#pretable")
            // .attr('class','result-pretable');
        if(activity=="preview"){
            data= dataArray['tokenList'][0];
            console.log("preview",data);
        }
        else if(activity=="runProcessing"){
            data = dataArray['tokenList'];
            // console.log("runProcess",data);
        }
        figure.append("div").text('키워드:'+dataArray['keyword']);
        figure.append("div").text('전처리 날짜:'+dataArray['processedDate']);
        figure.append("div").text('토큰 개수:'+dataArray['nTokens']);

        const table = figure.append("div").style('height','200px')
        .style('overflow','auto')
        .append("table").style('width','100%');
    
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

        $('#mask').append("<button id='cancelbtn' style='position: absolute; margin: 0px auto;display: block;'>창닫기</button>");
        // $('#cancelbtn').click()
        // $(document).on("click", "#cancelbtn", this.closeLoadingWithMask());
    }
    
    
    closeLoadingWithMask() {
        $('#mask, #loading').hide();
        $('#mask, #loading').empty(); 
    }

    clearResult(){
        d3.selectAll('figure > *').remove();
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

    public get isSelectedPreprocessed(): boolean {
        return this._isSelectedPreprocessed;
    }
    public set isSelectedPreprocessed(value: boolean) {
        this._isSelectedPreprocessed = value;
    }


    public get isDataPreprocessed() {
        return this._isDataPreprocessed;
      }
      public set isDataPreprocessed(value) {
        this._isDataPreprocessed = value;
      }

    public get isDataPreview(): boolean {
        return this._isDataPreview;
    }
    public set isDataPreview(value: boolean) {
        this._isDataPreview = value;
    }

    public get email(): string {
        return this._email;
    }
    public set email(value: string) {
        this._email = value;
    }
}