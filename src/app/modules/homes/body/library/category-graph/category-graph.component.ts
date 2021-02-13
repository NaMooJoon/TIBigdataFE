import { Component, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {
  ChartConfiguration,
  ChartDataSets,
  ChartOptions,
  ChartType,
} from "chart.js";
import { Color, Label, SingleDataSet } from "ng2-charts";
import { Res } from "src/app/modules/communications/fe-backend-db/res.model";

@Component({
  selector: "app-category-graph",
  templateUrl: "./category-graph.component.html",
  styleUrls: ["./category-graph.component.less"],
})
export class CatGraphComponent implements OnInit {
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

  async getTopicCounts() {
    await this.httpClient
      .post<any>(this.GET_TOPIC_URL, {})
      .toPromise()
      .then((result: Res) => {
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

    console.log(this.chartData);
    this.isChartLoaded = true;
  }
}
