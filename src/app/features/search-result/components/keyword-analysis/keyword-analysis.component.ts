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

  constructor(private elasticsearchService: ElasticsearchService) {
    this.searchSubscriber = this.elasticsearchService
                                .getSearchStatus()
                                .subscribe(() => {
                                  this.setSearchKeyword();
                                });
  }

  ngOnInit(): void {
    this.setSearchKeyword();
    this.drawChart();
  }

  ngOnDestroy() {
    this.searchSubscriber.unsubscribe();
  }

  setSearchKeyword() {
    this.searchKeyword = this.elasticsearchService.getKeyword();
  }

  year_clicked() {
    var yb = document.getElementById("year_button");
    var mb = document.getElementById("month_button");
    yb.style.background="lightgrey";
    mb.style.background="transparent";

    this.startYearMonth = document.getElementById("start_month").value;
    this.endYearMonth = document.getElementById("end_month").value;
    this.per = "year";
  }

  month_clicked() {
    var yb = document.getElementById("year_button");
    var mb = document.getElementById("month_button");
    mb.style.background="lightgrey";
    yb.style.background="transparent";

    this.startYearMonth = document.getElementById("start_month").value;
    this.endYearMonth = document.getElementById("end_month").value;
    this.per = "month";
  }

  updateFigure() {
    //when analysis button is clicked, replace data based on the selected inputs.
    // 1) get search history based on the inputs
        
    // 2) update figure
  }

  async getSearchHistoryFromElasticSearch() {
    var current = new Date();
    var y = current.getFullYear();
    var c_month = current.getMonth() + 1;
    if(c_month < 10) {
      this.currentYearMonth = "" + y + "-0" +  c_month;
    }
    else {
      this.currentYearMonth = "" + y + "-" +  c_month;
    }

    var month = [3,4,5,6,7,8,9,10,11,12,1,2,3,4,5,6,7];
    var cnt = [];
    var idx = -1;
    for(var i = 5 ; i < 17; i++){
      if(month[i] == c_month) {
        idx = i;
        break;
      }
    }
    if(idx == -1){
      console.log("IDX_ERROR");
    }
    for(var j = 0; j < 6; j ++){
      var m;
      if(month[idx] < 10){
        m = "0" + month[idx];
      }
      else {
        m = "" + month[idx];
      }
      //search_log-<year>.<month>
      var index = "search_log-" + y + "." + m;
      var count;
      try {
        count = await this.elasticsearchService.getSearchHistory(index);
        const hist = {date: "" + y + "." + m, freq: count["count"]};
        this.searchHistory.push(hist);
      }
      catch (e) {
        console.log("There is no log file for year: " + y + ", month: " + m);
        const hist = {date: "" + y + "." + m, freq: 0};
        this.searchHistory.push(hist);
      }

      if(month[idx] < month[idx - 1]){
              y = y - 1;
      }
      idx = idx -1;
    }
    console.log("search history");
    console.log(this.searchHistory);
  }

  async drawChart(){
    await this.getSearchHistoryFromElasticSearch();

    const histData = this.searchHistory.reverse();
    console.log("json");
    console.log(histData);

    var margin = 50;
    var margina = {top: 10, right: 30, bottom: 30, left: 40};
    var width = 500 - (margin * 2);
    var height = 300 - (margin * 2);

    const svg = d3.select("#keyword-analysis")
                   .append("svg")
                   .attr("width", width + (margin * 2))
                   .attr("height", height + (margin * 2))
                   .append("g")
                   .attr("transform", "translate(" + margin + "," + margin + ")");

    // Create the X-axis band scale
    const x = d3.scaleBand().range([0, width])
                            .domain(histData.map(d => d.date))
                            .padding(0.2);

    // Draw the X-axis on the DOM
    svg.append("g").attr("transform", "translate(0," + height + ")")
                   .call(d3.axisBottom(x))
                   .selectAll("text")
                   .attr("transform", "translate(-10,0)rotate(-45)")
                   .style("text-anchor", "end");

    // Create the Y-axis band scale
    const y = d3.scaleLinear().domain([0, d3.max(histData, d => d.freq)])
                              .range([height, 0]);

    var maxY = d3.max(histData, d => d.freq);
    var fixedTicks = [];
    for(var i = 1; i <= 5; i ++) {
      fixedTicks.push(Math.round((maxY * i) / 5));
    }
    console.log(fixedTicks);
    // Draw the Y-axis on the DOM
    svg.append("g").call(d3.axisLeft(y)
                           .tickValues(fixedTicks));

    // Create and fill the bars
    svg.selectAll("bars")
       .data(histData)
       .enter()
       .append("rect")
       .attr("x", d => x(d.date))
       .attr("y", d => y(d.freq))
       .attr("width", 10)
       .attr("height", (d) => height - y(d.freq))
       .attr("fill", "#80D0FC");
  }

  public get getSearchKeyword(): string {
    return this.searchKeyword;
  }

  public get getCurrentYearMonth(): string {
      return this.currentYearMonth;
    }
}


