import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommunityServiceService } from 'src/app/modules/communications/fe-backend-db/community/community-service.service';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import {Location} from '@angular/common';

@Component({
  selector: 'app-write-new-community-doc',
  templateUrl: './write-new-community-doc.component.html',
  styleUrls: ['./write-new-community-doc.component.less']
})
export class WriteNewCommunityDocComponent implements AfterViewInit {
  @ViewChild('result',{static: false}) result: ElementRef;
  @ViewChild('tbString',{static: false}) tbString: ElementRef;
  @ViewChild('fontColor',{static: false}) fontColor: ElementRef;
  @ViewChild('fontSize',{static: false}) fontSize: ElementRef;
  @ViewChild('fontOptions',{static: false}) fontOptions: ElementRef;
  @ViewChild('pRef', {static: false}) pRef: ElementRef;

      // var objResult = document.getElementById("result");
  
    // var tbString = document.getElementById("tbString");
  
    // var fontColor = document.getElementById("fontColor");
  
    // var fontSize = document.getElementById("fontSize");
  
    // var fontOptions = document.getElementsByName("fontOptions");

  constructor( private router: Router, private cm_svs : CommunityServiceService, private auth : EPAuthService, private _location: Location) { }

    ngAfterViewInit() {
    console.log(this.pRef.nativeElement.innerHTML); 
    this.pRef.nativeElement.innerHTML = "DOM updated successfully!!!"; 
  }
  private title : string;
  private content : string;
  private fondOptions : boolean[] = [];


  /**
   * @description 테스트로 더미 100개
   */
  async testSave100(){
    for(var i = 0 ; i < 100 ; i ++){
      let newID = await this.createDocId();
      let body = {
        user: "user" + i, 
        title : "title" + i,
        content: "content" + i,
        docId : newID

     }
      this.cm_svs.writeNewDoc(body);

    }
    this.toCommunity();

  }

  previewString(){
 
    // var objResult = document.getElementById("result");
  
    // var tbString = document.getElementById("tbString");
  
    // var fontColor = document.getElementById("fontColor");
  
    // var fontSize = document.getElementById("fontSize");
  
    // var fontOptions = document.getElementsByName("fontOptions");
  
  
  
  
  
  
  
    //tag id name 이3개를 읽을수 있음
  
  
    console.log(this.tbString, this.fontColor, this.fontOptions);
  
    var targetString = this.tbString.nativeElement.value; 
  
    targetString = targetString.fontcolor(this.fontColor.nativeElement.options[this.fontColor.nativeElement.selectedIndex].value);
  
       targetString = targetString.fontsize(this.fontSize.nativeElement.options[this.fontSize.nativeElement.selectedIndex].value);
  
       
  
    if(this.fondOptions[0]){
  
     targetString = targetString.strike();
  
    }
  
    if(this.fondOptions[1]){
  
     targetString = targetString.big();
  
    }
  
    if(this.fondOptions[2]){
  
     targetString = targetString.small();
  
    }
  
    if(this.fondOptions[3]){
  
     targetString = targetString.bold();
  
    }
  
    if(this.fondOptions[4]){
  
     targetString = targetString.italic();
  
    }
  
    if(this.fondOptions[5]){
  
     targetString = targetString.sup();
  
    }
  
    if(this.fondOptions[6]){
  
     targetString = targetString.sub();
  
    }
  
    if(this.fondOptions[7]){
  
     targetString = targetString.toLowerCase();
  
    }
  
    if(this.fondOptions[8]){
  
     targetString = targetString.toUpperCase();
  
    }
  
     this.result.nativeElement.innerHTML = targetString;
    //  this.content = this.result;
  
   
  
  
  
  
   }

  setFontOptions($event){
    console.log("hello?")
    console.log($event.target.value);
    event.preventDefault();
  }

  updateContent($event){
    this.content = $event.target.value;
  }
  updateTitle($event){
    this.title = $event.target.value;
  }

  async saveNewDocument(){
    // this.testSave100();
    let newID = await this.createDocId();
    console.log("save new doc new id : ", newID);
    let userName = this.auth.getUserName();
    let body = {
      user : userName,
      title : this.title,
      content : this.content,
      docId : newID
    };

    console.log(body)

    await this.cm_svs.writeNewDoc(body);
    console.log("save new doc end")
    this.toCommunity();
  }

  async createDocId(){
    let res = await this.cm_svs.getDocsNum();
    let numDocs = res.payload.data;
    return numDocs + 1;
  }

  toCommunity(){
  // this.saveNewDocument();
  // this.testSave100();

    this.router.navigateByUrl("/community/qna");
  }

  gotoList() {
    this._location.back();
  }

}
