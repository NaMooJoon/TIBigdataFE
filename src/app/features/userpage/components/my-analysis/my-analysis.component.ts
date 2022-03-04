import { Component, OnInit, Input, Inject } from '@angular/core';
import { UserProfile } from 'src/app/core/models/user.model';
import { AnalysisOnMiddlewareService } from "src/app/core/services/analysis-on-middleware-service/analysis.on.middleware.service";
import { AuthenticationService } from 'src/app/core/services/authentication-service/authentication.service';
import { UserSavedDocumentService } from 'src/app/core/services/user-saved-document-service/user-saved-document.service';
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { AnalysisComponent } from 'src/app/features/article-analysis/components/analysis/analysis.component'


@Component({
  selector: 'app-my-analysis',
  templateUrl: './my-analysis.component.html',
  styleUrls: ['./my-analysis.component.less']
})

export class MyAnalysisComponent extends AnalysisComponent implements OnInit {
  
  private _charts : any;
  private _userProfile :UserProfile

  private _savedKeywords : Array<{ keyword: string, savedDate: string; }>;
  private _isSavedKeywordsEmpty : boolean;
  private _isSavedKeywordsLoaded : boolean;
  private _isSavedChartsEmpty : boolean;
  private _isSavedChartsLoaded : boolean;
  private _keyword : string;
  private _savedDate : string;
  private _chartData : any;

  private _form : FormGroup;
  
  constructor(
    _middlewareService : AnalysisOnMiddlewareService,
    _userSavedDocumentService : UserSavedDocumentService,
    private authService : AuthenticationService,
    private formBuilder : FormBuilder
  ){
    super(_middlewareService, _userSavedDocumentService); //Analysis Component로부터 상속
    this.userProfile = this.authService.getCurrentUser();
    this.form = this.formBuilder.group({
      checkArray : this.formBuilder.array([])
    });
  }
  ngOnInit(): void {
    this.loadSavedKeywords();
    /* this.form = this.formBuilder.group({
      checkArray : this.formBuilder.array([])
    }); */
  }

  async loadSavedKeywords() : Promise<void>{
    this.isSavedKeywordsEmpty = true;
    this.isSavedKeywordsLoaded = false;
    this.savedKeywords = await this.userSavedDocumentService.getMyKeywords();
    if(this.savedKeywords.length === 0){ 
      this.isSavedKeywordsEmpty = true;
      //console.log("No keywords saved");
    }else{
      this.isSavedKeywordsEmpty = false;
      this.isSavedKeywordsLoaded = true;
      console.log(this.savedKeywords);
    }
    this.getCharts(this.savedKeywords[0].keyword, this.savedKeywords[0].savedDate);
  }

  /**
   * @description Load saved charts from middlewareService
   * @param keyword
   */
  async getCharts(selectedKeyword : string, savedDate : string) : Promise<void> {
    this.isSavedChartsEmpty = true;
    this.isSavedChartsLoaded = false;
    let data = JSON.stringify({
      'userEmail': this.userProfile.email,
      'keyword' : selectedKeyword,
      'savedDate' : savedDate
    });
    this.charts = await this.middlewareService.postDataToFEDB('/textMining/getCharts',data);
    if(this.charts.length === 0){
      this.isSavedChartsEmpty = true;
    }else{
      this.isSavedChartsEmpty = false;
      this.isSavedChartsLoaded = true;
    }
    console.log(this.charts);
    
    //checkbox 초기화
    for(let i in this.charts){
      this.charts[i]["isSelected"] = false;
    }
  }

  currentKeywordAndDate(selectedKeyword: string, savedDate: string){
    this.keyword = selectedKeyword;
    this.savedDate = savedDate;
    this.getCharts(this.keyword, this.savedDate);
  }

  async showDetail(chart: any) : Promise<void>{
    let win = window.open("","","width=500, height=600")
    win.document.write("<p>새 창</p>");
  }

  async deleteSelectedCharts() : Promise<void>{
    if(this.form.value["checkArray"].length == 0){
      alert("삭제할 차트가 없습니다! 삭제할 차트를 선택해주세요.")
    }else{
      for(let i in this.form.value["checkArray"]){
        let data = JSON.stringify({
          'userEmail' : this.userProfile.email,
          'analysisDate': this.form.value["checkArray"][i]
        });
        let res = await this.middlewareService.postDataToFEDB('/textMining/deleteCharts',data);
        console.log(res);
    }
    this.loadSavedKeywords();
    this.form.value["checkArray"].clear;
   }
  }  

  checkUncheckAll(isCheckAll: boolean, checkArray: FormArray): FormArray {
    if(isCheckAll){
      for(let i=0; i<this.charts.length; i++){
        checkArray.push(new FormControl(this.charts[i]["analysisDate"]))
      }
    }else{
      checkArray.clear();
    }

    for(let i=0; i<this.charts.length; i++){
      this.charts[i]["isSelected"] = isCheckAll;
    }
    return checkArray;
  }

  onCheckboxChange(e): void {
    let checkArray: FormArray = this.form.get("checkArray") as FormArray;
    if (e.target.value === "toggleAll") {
      checkArray = this.checkUncheckAll(e.target.checked, checkArray);
    } else {
      if (e.target.checked) {
        checkArray.push(new FormControl(e.target.value));  
      } else {
        let i: number = 0;
        checkArray.controls.forEach((item: FormControl) => {
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            console.log(checkArray);

            return;
          }
          i++;
        });
      }
    }
  }


  public get charts() : any{
    return this._charts;
  }
  public set charts(value : any){
    this._charts = value;
  }

  public get userProfile(): UserProfile {
    return this._userProfile;
  }
  public set userProfile(value: UserProfile) {
    this._userProfile = value;
  }

  public get form(): FormGroup {
    return this._form;
  }
  public set form(value: FormGroup) {
    this._form = value;
  }

  public get savedKeywords() : Array<{ keyword: string, savedDate: string; }>{
    return this._savedKeywords;
  }
  public set savedKeywords(value: Array<{ keyword: string, savedDate: string; }>){
    this._savedKeywords = value;
  }

  public get isSavedKeywordsEmpty(): boolean {
    return this._isSavedKeywordsEmpty;
  }
  public set isSavedKeywordsEmpty(value: boolean){
    this._isSavedKeywordsEmpty = value;
  }

  public get isSavedKeywordsLoaded(): boolean {
    return this._isSavedKeywordsLoaded;
  }
  public set isSavedKeywordsLoaded(value: boolean){
    this._isSavedKeywordsLoaded = value;
  }

  public get isSavedChartsEmpty(): boolean {
    return this._isSavedChartsEmpty;
  }
  public set isSavedChartsEmpty(value: boolean){
    this._isSavedChartsEmpty = value;
  }

  public get isSavedChartsLoaded(): boolean {
    return this._isSavedChartsLoaded;
  }
  public set isSavedChartsLoaded(value: boolean){
    this._isSavedChartsLoaded = value;
  }


  public get keyword() : string {
    return this._keyword;
  }
  public set keyword(value : string){
    this._keyword = value;
  }

  public get savedDate() : string {
    return this._savedDate;
  }
  public set savedDate(value: string) {
    this._savedDate = value;
  }

  public get chartData() : any {
    return this._chartData;
  }
  public set chartData(value: any) {
    this._chartData = value;
  } 
}