import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CloudData, CloudOptions } from 'angular-tag-cloud-module';
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service'
import { AnalysisDatabaseService } from '../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service';
import * as CanvasJS from '../../../../../../assets/canvasjs.min.js';
import CirclePack from 'circlepack-chart';
import { ConfigService } from './category-graph.service';

import Sunburst from 'sunburst-chart';

import { Observable, of } from 'rxjs';

import { dataSet } from './nodes';
import { _topic } from './nodes';
import { doc } from './nodes';


@Component({
  selector: 'app-category-graph',
  templateUrl: './category-graph.component.html',
  providers: [ConfigService],
  styleUrls: ['./category-graph.component.less']
})


export class CatGraphComponent implements OnInit {
  constructor(private db: AnalysisDatabaseService, private http: HttpClient, private es: ElasticsearchService, private configService: ConfigService) { }

  // private BASE_URL: string = 'http://localhost:5000/wordrank';
  // private TEST_URL: string = 'http://localhost:5000/three';

  private title: string = "개별 문서를 선택하세요! :)";
  private contents: string;
  private keywords: string;

  ngOnInit() {
    // // this.http.get("")
    // // console.log("started")
    // this.db.getTopicTable().then(data => {
    //   // console.log("test");
    //   console.log(data);
    //   // this.configService.getConfig().subscribe(data => {
    //   /**
    //    * 플라스크는 업데이트가 있을 때마다 static file을 업데이트 해서 asset 폴더에 넣어준다.
    //    * 
    //    * 마지막 static file update 시간을 local에서 불러온다
    //    * 가지고 온 data 파일에서 마지막 업데이트 시간을 읽는다.
    //    * 같으면 그대로 진행.
    //    */
    //   // console.log(data);

    //   var num_topic = data.length;
    //   var dataset = new dataSet();
    //   var chds = new Array<_topic>();
    //   dataset.name = "통일 연구 동향";

    //   dataset.children = chds;


    //   for (var i = 0; i < num_topic; i++) {
    //     dataset.children[i] = new _topic();
    //     var parentNode = dataset.children[i];
    //     parentNode.name = data[i]["_id"];//"Topic #"+ i;
    //     // parentNode.tooltipTitle = "tooltop?";
    //     parentNode.order = i;

    //     // parentNode.showTooltip = true;
    //     parentNode.value = 30;//data[i].length * 1000000;
    //     // parentNode.children = new Array<doc>();
    //     parentNode.children = data[i]["info"]
    //     // console.log(parentNode.children);

    //   }


    //   //   var myChart = Sunburst();
    //   //   myChart.data(dataset)
    //   //     .width(500)
    //   //     .height(500)
    //   //     .label('name')
    //   //     // .minSliceAngle(0.4)	
    //   //     .size('value')
    //   //     .showTooltip((d) => {
    //   //       if (d.level == "root")
    //   //         return false;
    //   //       else
    //   //         return d.name;
    //   //     })
    //   //     .tooltipTitle((d) => {
    //   //       if (d.level != "root")
    //   //         return d.name;
    //   //       else
    //   //         return false;
    //   //     })
    //   //     // .showLabels(true)
    //   //     .color('color')
    //   //     .onClick((d) => {
    //   //       console.log(d)
    //   //       if (d.level == "child") {
    //   //         this.title = "" + d.name;
    //   //         this.contents = "Contents : " + d.contents;
    //   //         this.keywords = "Keywords : " + d.keyWords;

    //   //         console.log(d.name + d.contents + d.keyWords);

    //   //       }
    //   //       else
    //   //         myChart.focusOnNode(d);
    //   //     })
    //   //     (
    //   //       // document.getElementById('chartSun'),
    //   //       document.getElementById('chartSun')
    //   //     );

    //   // }
    //   // );//this.configService.getConfig().subscribe






    //   // // }
    //   // addChildren(parentNode, num_doc, data, i) {
    //   //   for (var j = 0; j < num_doc; j++) { //개별 토픽 안에서 각각 문서 선택
    //   //     parentNode.children[j] = new doc();
    //   //     var node = parentNode.children[j];
    //   //     node.url = "To Be Added...";
    //   //     node.name = data[i][j][1];  //totalData[[topic1],...,[[문서 이름,문서 내용],...,[문서 이름,문서 내용]]
    //   //     // i번째 문서, 0은 그 문서 선택, 1이 문서 내용 선택
    //   //     node.value = parentNode.value / num_doc; // 모든 문서들의 크기는 전체 토픽 크기의 N 등분
    //   //     node.keyWords = data[i][j][2];
    //   //   }
    //   // }


  }
}
