import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";
import * as d3 from 'd3';
import { Tooltip } from "chart.js";

@Component({
  selector: 'app-keyword-analysis',
  templateUrl: './keyword-analysis.component.html',
  styleUrls: ['./keyword-analysis.component.less']
})
export class KeywordAnalysisComponent implements OnInit, OnDestroy {
  private searchHistory = [];
  private searchSubscriber: Subscription;
  private searchKeyword: string;
  private currentYearMonth: string;
  private startYearMonth: string;
  private endYearMonth: string;
  private per: string;

  //related to drawing chart
  // set the dimensions and margins of the graph
  private margin;
  private width;
  private height;
  // append the svg object to the body of the page
  private svg;
  // Initialize the X axis
  private x;
  private xAxis;
  // Initialize the Y axis
  private y;
  private yAxis;

  constructor(private elasticsearchService: ElasticsearchService) {
    this.searchSubscriber = this.elasticsearchService
                                .getSearchStatus()
                                .subscribe(() => {
                                  this.setSearchKeyword();
                                });
  }

  ngOnInit(): void {
    this.setSearchKeyword();
    this.setMinMaxDate();
    this.initFigure();
  }

  ngOnDestroy() {
    this.searchSubscriber.unsubscribe();
  }

  setSearchKeyword() {
    this.searchKeyword = this.elasticsearchService.getKeyword();
  }

  setMinMaxDate(){
    var current = new Date();
    var year = current.getFullYear();
    var c_month = current.getMonth() + 1;
    if(c_month < 10) {
      this.currentYearMonth = "" + year + "-0" +  c_month;
    }
    else {
      this.currentYearMonth = "" + year + "-" +  c_month;
    }
  }

  year_clicked() {
    var yb = document.getElementById("year_button");
    var mb = document.getElementById("month_button");
    yb.style.background="lightgrey";
    mb.style.background="transparent";

    this.startYearMonth = (<HTMLInputElement>document.getElementById("start_month")).value;
    this.endYearMonth = (<HTMLInputElement>document.getElementById("end_month")).value;
    this.per = "year";
  }

  month_clicked() {
    var yb = document.getElementById("year_button");
    var mb = document.getElementById("month_button");
    mb.style.background="lightgrey";
    yb.style.background="transparent";

    this.startYearMonth = (<HTMLInputElement>document.getElementById("start_month")).value;
    this.endYearMonth = (<HTMLInputElement>document.getElementById("end_month")).value;
    this.per = "month";
  }

  updateChart(){
    this.startYearMonth = (<HTMLInputElement>document.getElementById("start_month")).value;
    this.endYearMonth = (<HTMLInputElement>document.getElementById("end_month")).value;

    const data1 = [
      {group: "A", value: 4},
      {group: "B", value: 16},
      {group: "C", value: 8}
    ];

    const data2 = [
      {group: "A", value: 7},
      {group: "B", value: 1},
      {group: "C", value: 20},
      {group: "D", value: 10}
    ];

    var x = this.x;
    var xAxis = this.xAxis;
    var y = this.y;
    var yAxis = this.yAxis;
    var svg = this.svg;
    var height = this.height;

    function update(data) {
      // Update the X axis
      x.domain(data.map(d => d["group"]))
      xAxis.call(d3.axisBottom(x))
      // Update the Y axis
      y.domain([0, d3.max(data, function(d) { return d["value"]; }) ] as number[]);
      yAxis.transition().duration(1000).call(d3.axisLeft(y));
      // Create the u variable
      var u = svg.selectAll("rect")
                 .data(data);
      u.join("rect") // Add a new rect for each new elements
       .transition()
       .duration(1000)
       .attr("x", d => x(d["group"]))
       .attr("y", d => y(d["value"]))
       .attr("width", x.bandwidth())
       .attr("height", d => height - y(d["value"]))
       .attr("fill", "#69b3a2");
    }
    //For test
    if(this.startYearMonth == "2022-01" && this.endYearMonth == "2022-01"){
      console.log("data1");
      update(data1);
    }
    else {
      console.log("data2");
      update(data2);
    }
  }

  initFigure() {
    //related to drawing chart
    // set the dimensions and margins of the graph
    this.margin = {top: 30, right: 30, bottom: 70, left: 60};
    this.width = 460 - this.margin.left - this.margin.right;
    this.height = 400 - this.margin.top - this.margin.bottom;

    // append the svg object to the body of the page
    this.svg = d3.select("#keyword_analysis")
                 .append("svg")
                 .attr("width", this.width + this.margin.left + this.margin.right)
                 .attr("height", this.height + this.margin.top + this.margin.bottom)
                 .append("g")
                 .attr("transform",
                       "translate(" + this.margin.left + "," + this.margin.top + ")");
    // Initialize the X axis
    this.x = d3.scaleBand()
               .range([ 0, this.width ])
               .padding(0.2);
    this.xAxis = this.svg.append("g")
                         .attr("transform", "translate(0," + this.height + ")");

    // Initialize the Y axis
    this.y = d3.scaleLinear()
               .range([ this.height, 0]);
    this.yAxis = this.svg.append("g")
                         .attr("class", "myYaxis");
    this.updateChart();
  }

//   async getSearchHistoryFromElasticSearch() {
//     var month = [3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7];
//     var cnt = [];
//     var idx = -1;
//     for(var i = 5 ; i < 17; i++){
//       if(month[i] == c_month) {
//         idx = i;
//         break;
//       }
//     }
//     if(idx == -1){
//       console.log("IDX_ERROR");
//     }
//     for(var j = 0; j < 6; j ++){
//       var m;
//       if(month[idx] < 10){
//         m = "0" + month[idx];
//       }
//       else {
//         m = "" + month[idx];
//       }
//       //search_log-<year>.<month>
//       var index = "search_log-" + y + "." + m;
//       var count;
//       try {
//         count = await this.elasticsearchService.getSearchHistory(index);
//         const hist = {date: "" + y + "." + m, freq: count["count"]};
//         this.searchHistory.push(hist);
//       }
//       catch (e) {
//         console.log("There is no log file for year: " + y + ", month: " + m);
//         const hist = {date: "" + y + "." + m, freq: 0};
//         this.searchHistory.push(hist);
//       }
//
//       if(month[idx] < month[idx - 1]){
//               y = y - 1;
//       }
//       idx = idx -1;
//     }
//     console.log("search history");
//     console.log(this.searchHistory);
//   }

  public get getSearchKeyword(): string {
    return this.searchKeyword;
  }

  public get getCurrentYearMonth(): string {
      return this.currentYearMonth;
    }
}


