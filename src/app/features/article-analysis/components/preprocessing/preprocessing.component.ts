import { Component, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { PaginationModel } from "src/app/core/models/pagination.model";
import { ArticleService } from "src/app/core/services/article-service/article.service";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service";
import { UserSavedDocumentService } from 'src/app/core/services/user-saved-document-service/user-saved-document.service';
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Component({
  selector: "app-preprocessing",
  templateUrl: "./preprocessing.component.html",
  styleUrls: ["./preprocessing.component.less"],
})

export class PreprocessingComponent implements OnInit {
  private _isDataPreprocessed = false;
  private _preprocessedData: Array<string>;

  toMiddleWare(){
    const http_req = new XMLHttpRequest();
    http_req.open("POST", "https://kubic.handong.edu:15000/preprocessing");
    http_req.setRequestHeader('Content-Type', 'application/json');

    var data = {
      userEmail:"sujinyang@handong.edu", 
      keyword:"북한", 
      savedDate:"2021-07-08T11:46:03.973Z",
      synonym: true,
      stopword: true,
      compound: true,
      wordclass: "010" //(100) 동사, 010(명사), 001(형용사)
    };

    http_req.send(JSON.stringify(data));
    // let data = http_req.responseText("result");
    http_req.onload = () => {
      console.log("응답:"+ JSON.parse(http_req.responseText).result[0].slice(0,50));
      this.preprocessedData = JSON.parse(http_req.responseText).result[0].slice(0,50);
      // console.log("Flask 서버로부터의 응답은: " + http_req.responseText);
    }
    // if(http_req.status==200)
      this.isDataPreprocessed =true;
  //   $(function () {
  //   var data = {userEmail:"sujinyang@handong.edu", keyword:"북한", savedDate:"2021-07-08T11:46:03.973Z"};
  //   $.ajax({
  //       type: "POST",
  //       data :JSON.stringify(data),
  //       url: "http://kubic.handong.edu:15000/preprocessing",
  //       contentType: "application/json",
        
  //   });
  // });
  }

  previewPreprocessedData(){
    document.getElementById("pop").style.display='inline';
    // var url = "popup.html";
    // var name = "preview data";
    // var option = "width = 500, height = 500, top = 100, left = 200, location = no, scrollbars=yes";
    // window.open(url, name, option);
  }

  public get isDataPreprocessed() {
    return this._isDataPreprocessed;
  }
  public set isDataPreprocessed(value) {
    this._isDataPreprocessed = value;
  }

  
  public get preprocessedData(){
    return this._preprocessedData;
  }

  public set preprocessedData(value){
    this._preprocessedData = value;
  }
}