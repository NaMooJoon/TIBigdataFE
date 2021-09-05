import { Component, OnInit, Output } from "@angular/core";
import { MyDocsComponent } from "src/app/features/userpage/components/my-docs/my-docs.component";
import { MydocModel } from "src/app/core/models/mydoc.model";
import { UserProfile } from "src/app/core/models/user.model";
import { UserSavedDocumentService } from 'src/app/core/services/user-saved-document-service/user-saved-document.service';
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { Router } from "@angular/router";
import { AuthenticationService } from "src/app/core/services/authentication-service/authentication.service";
import { EventEmitter } from "@angular/core";

@Component({
  selector: "app-savedDocForAnalysis",
  templateUrl: "./savedDocForAnalysis.component.html",
  styleUrls: ["../../analysis-style.less"],
})

export class savedDocForAnalysis implements OnInit{
    
  private _savedDocs: Array<MydocModel>;

  private _isSavedDocsLoaded: boolean = false;
  private _isSavedDocsEmpty: boolean;
  private _totalSavedDocsNum: number;
  
  private _userProfile: UserProfile;

  constructor(
    private userSavedDocumentService: UserSavedDocumentService,
    private authenticationService: AuthenticationService,
    )   {
      this.authenticationService.getCurrentUserChange().subscribe((currentUser) => {
      this.userProfile = currentUser;
    });
  }

  ngOnInit(){
    this.loadSavedDocs();
    this.emitData(); //send userEmail
  }

  
  @Output() sender = new EventEmitter();
  /**
   * @description Load saved documents from userSavedDocumentService
   * @param pageNum
   */
   async loadSavedDocs(): Promise<void> {
    this.savedDocs = await this.userSavedDocumentService.getAllMyDocs();
    this.isSavedDocsLoaded = true;

    this.totalSavedDocsNum = this.savedDocs.length;
    this.isSavedDocsEmpty = (this.totalSavedDocsNum === 0);
  }


  // updateSelectDoc(){
  //   const nodeList= <NodeListOf<HTMLInputElement>>document.getElementsByName('selectDoc');
  //   nodeList.forEach((node) => {
  //     if(node.checked)
  //       this.idx = parseInt(node.value);
  //   });
  // }

  emitData(activity?:string, selectedKeyword?:string, selectedSavedDate?:string, isSelectedPreprocessed?:boolean){
    this.sender.emit(JSON.stringify({
      'activity': activity,
      'email': this.userProfile.email,
      'savedKeyword': selectedKeyword,
      'savedDate': selectedSavedDate,
      'isSelectedPreprocessed':isSelectedPreprocessed,
    }));
  }

  public get savedDocs(): Array<MydocModel> {
      return this._savedDocs;
    }
  public set savedDocs(value: Array<MydocModel>) {
    this._savedDocs = value;
  }
  
  public get isSavedDocsLoaded() {
    return this._isSavedDocsLoaded;
  }
  public set isSavedDocsLoaded(value) {
    this._isSavedDocsLoaded = value;
  }
  
  public get isSavedDocsEmpty() {
    return this._isSavedDocsEmpty;
  }
  public set isSavedDocsEmpty(value) {
    this._isSavedDocsEmpty = value;
  }
  public get totalSavedDocsNum(): number {
    return this._totalSavedDocsNum;
  }
  public set totalSavedDocsNum(value: number) {
    this._totalSavedDocsNum = value;
  }
  
  public get userProfile(): UserProfile {
    return this._userProfile;
  }
  public set userProfile(value: UserProfile) {
    this._userProfile = value;
  }
}