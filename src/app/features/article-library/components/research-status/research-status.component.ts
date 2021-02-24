import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { Color, Label, SingleDataSet } from "ng2-charts";
import { QueryResponse } from "src/app/core/models/query.response.model";

@Component({
  selector: "app-research-status",
  templateUrl: "./research-status.component.html",
  styleUrls: ["./research-status.component.less"],
})
export class ResearchStatusComponent implements OnInit {
  constructor(private httpClient: HttpClient) {}
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  public chartLabels: Label[] = [["SciFi"], ["Drama"], "Comedy"];
  public chartData: SingleDataSet = [30, 50, 20];
  public chartType: ChartType = "pie";
  public chartLegend = false;
  public chartPlugins = [];
  private chartConfig: ChartConfiguration;
  private API_URL: string = "http://localhost:14000";
  private GET_TOPIC_URL: string = this.API_URL + "/topic/getTopicCounts";
  private isChartLoaded = false;

  async ngOnInit(): Promise<void> {
    await this.getTopicCounts();
  }

  /**
   * @description Get topics to show with chart 
   */
  async getTopicCounts() {
    await this.httpClient
      .post<any>(this.GET_TOPIC_URL, {})
      .toPromise()
      .then((result: QueryResponse) => {
        let items: Array<{
          _id: string;
          count: number;
        }> = result.payload as Array<any>;
        this.chartLabels = items.map((entry) => {
          if (entry._id === "") entry._id = "기타";
          return entry._id;
        });
        let data = items.map((entry) => {
          return entry.count;
        });

        this.chartData = data;
      });


    this.isChartLoaded = true;
  }
}
