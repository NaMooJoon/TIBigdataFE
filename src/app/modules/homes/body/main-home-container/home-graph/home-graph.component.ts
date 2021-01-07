import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CloudData, CloudOptions } from "angular-tag-cloud-module";
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import * as CanvasJS from "../../../../../../assets/canvasjs.min.js";
import { Router } from "@angular/router";
import { CategoryAnalysisHelperService } from 'src/app/modules/homes/analysis/category-analysis-helper.service';

import { Observable, of } from "rxjs";
import { CompileShallowModuleMetadata } from "@angular/compiler";
@Component({
  selector: "app-home-graph",
  templateUrl: "./home-graph.component.html",
  styleUrls: ["./home-graph.component.less"]
})
export class HomeGraphComponent implements OnInit {
  private data: any;
  private fileDir: string = "assets/homes_graph/wrTopic.json";
  private topics = {
    WHO: "전체",
    POL: "정치",
    ECO: "경제",
    SOC: "사회",
    CUL: "문화",
    INT: "국제",
    IT: "IT_과학",
    SPO: "스포츠"
  };

  options: CloudOptions = {
    // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value
    // width: 1000,
    // height: 250,
    // overflow: true
  };
  serverData: JSON;
  cData: CloudData[] = [];
  constructor(
    private anls : CategoryAnalysisHelperService,
    private _router : Router, 
    private http: HttpClient, 
    private es: ElasticsearchService) {}

  ngOnInit() {
    this.getWordCloud("TOT");
  }
  getWordCloud(topic) {
    var wColor = "pink";
    var docNum = -1;
    if (topic == "TOT") {
      wColor = "red";
      docNum = 0;
    } else if (topic == "POL") {
      wColor = "red";
      docNum = 1;
    } else if (topic == "ECO") {
      wColor = "orange";
      docNum = 2;
    } else if (topic == "SOC") {
      wColor = "gold";
      docNum = 3;
    } else if (topic == "CUL") {
      wColor = "green";
      docNum = 4;
    } else if (topic == "INT") {
      wColor = "blue";
      docNum = 5;
    } else if (topic == "IT") {
      wColor = "navy";
      docNum = 6;
    } else if (topic == "SPO") {
      wColor = "purple";
      docNum = 7;
    }

    // console.log(this.http.get(this.fileDir));
    this.http.get(this.fileDir).subscribe(data => {
      // console.log(data)
      // this.data = data;

      // Retrieve data from flask.
      const changedData$: Observable<CloudData[]> = of([]);
      changedData$.subscribe(res => (this.cData = res));

      //Convert data as JSON format.
      // this.serverData = data as unknown as JSON;#####################
      // for(let i in data){
      //   // data[i][1] = Math.round(data[i][1]* 10);
      // }
      //Push data for WordCloud.
      //console.log(data[0][1][0])

      // cul, eco, it, pol, soc,spo, innt, tot
      var sample = data[docNum]["keys"];
      
      
      for (let i in sample) {
        if (Number(i) >= 30) break;
        else if (Number(i) <= 4) {
          this.cData.push({
            text: sample[i][0],
            weight: sample[i][1],
            color: wColor
          });
          // console.log(sample[i][1])
        } else
          this.cData.push({
            text: sample[i][0],
            weight: sample[i][1],
            color: "gray"
          });
      }
    });
  }

  getTopicFromButtonClick(event) {
    var topic = this.anls.getTopicFromButtonClick(event);
    
    this.getWordCloud(topic);
  }

  logClicked(clicked: CloudData){
    let keyword = clicked["text"];
    // console.log(keyword);
    this.es.setKeyword(keyword);
    // this.queryText = keyword;
    this._router.navigateByUrl("search");
  }

  relatedSearch(keyword: string) {
    this.es.setKeyword(keyword);
    // this.queryText = keyword;
    this._router.navigateByUrl("search");
    // this.loadResultPage();
  }

  // Original Version Below

  // private topics = {
  //   WHO : "전체",
  //   POL : "정치",
  //   ECO : "경제",
  //   SOC : "사회",
  //   CUL : "문화",
  //   INT : "국제",
  //   REG : "지역",
  //   SPO : "스포츠"
  // }

  // options: CloudOptions = {
  //   // if width is between 0 and 1 it will be set to the size of the upper element multiplied by the value
  //   width: 1000,
  //   height: 250,
  //   overflow: true,
  // };
  // serverData: JSON;
  // cData: CloudData[] = [];
  // constructor(private http:HttpClient, private es: ElasticsearchService) { }

  // ngOnInit() {
  //   this.getWordCloud("전체");
  // }

  // getWordCloud(topic){
  //   this.http.get(this.BASE_URL).subscribe(data => {

  //     //Retrieve data from flask.
  //     const changedData$: Observable<CloudData[]> = of([]);
  //     changedData$.subscribe(res => this.cData = res);

  //     //Convert data as JSON format.
  //     this.serverData = data as JSON;

  //     //Push data for WordCloud.
  //     for(let i in data){
  //       this.cData.push({text:data[i]["label"], weight:data[i]["y"]})
  //     }
  //     //console.log(this.cData);
  //   })

  // }

  // getTopic(event){
  //   var topic = event.target.id;
  //   this.getWordCloud(topic);
  //  }
}
