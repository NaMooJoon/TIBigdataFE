import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ChartConfiguration, ChartOptions, ChartType } from "chart.js";
import { Color, Label, SingleDataSet } from "ng2-charts";
import { QueryResponse } from "src/app/core/models/query.response.model";
import { IpService } from "src/app/core/services/ip-service/ip.service";

@Component({
  selector: "app-research-status",
  templateUrl: "./research-status.component.html",
  styleUrls: ["./research-status.component.less"],
})
export class ResearchStatusComponent implements OnInit {
  constructor(private httpClient: HttpClient,
    private ipsService: IpService) { }
  public chartOptions: ChartOptions = {
    responsive: true,
  };
  public chartLabels: Label[] = [["SciFi"], ["Drama"], "Comedy"];
  public chartData: SingleDataSet = [30, 50, 20];
  public chartType: ChartType = "pie";
  public chartLegend = false;
  public chartPlugins = [];
  private _chartConfig: ChartConfiguration;
  private _API_URL: string = this.ipsService.getFrontDBServerIp();
  private _GET_TOPIC_URL: string = this.API_URL + "/topic/getTopicCounts";
  private _isChartLoaded = false;

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

  public get chartConfig(): ChartConfiguration {
    return this._chartConfig;
  }
  public set chartConfig(value: ChartConfiguration) {
    this._chartConfig = value;
  }
  public get API_URL(): string {
    return this._API_URL;
  }
  public set API_URL(value: string) {
    this._API_URL = value;
  }
  public get GET_TOPIC_URL(): string {
    return this._GET_TOPIC_URL;
  }
  public set GET_TOPIC_URL(value: string) {
    this._GET_TOPIC_URL = value;
  }
  public get isChartLoaded() {
    return this._isChartLoaded;
  }
  public set isChartLoaded(value) {
    this._isChartLoaded = value;
  }
}
