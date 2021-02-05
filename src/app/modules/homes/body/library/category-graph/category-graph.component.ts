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
    this.http.get("")
    console.log("started")
    this.db.getTopicTable().then(data => {
      console.log(data);
      var num_topic = data.length;
      var dataset = new dataSet();
      var chds = new Array<_topic>();
      dataset.name = "통일 연구 동향";
      dataset.children = chds;


      for (var i = 0; i < num_topic; i++) {
        dataset.children[i] = new _topic();
        var parentNode = dataset.children[i];
        parentNode.name = data[i]["_id"];//"Topic #"+ i;
        parentNode.tooltipTitle = "tooltop?";
        parentNode.order = i;


        parentNode.value = 30;//data[i].length * 1000000;
        parentNode.children = new Array<doc>();
        parentNode.children = data[i]["info"]
        console.log(parentNode.children);

      }


      var myChart = Sunburst();
      myChart.data(dataset)
        .width(500)
        .height(500)
        .label('name')
        // .minSliceAngle(0.4)	
        .size('value')

        // .showLabels(true)
        .color('color')

        (
          // document.getElementById('chartSun'),
          document.getElementById('chartSun')
        );

    }
    );//this.configService.getConfig().subscribe








  }
}
