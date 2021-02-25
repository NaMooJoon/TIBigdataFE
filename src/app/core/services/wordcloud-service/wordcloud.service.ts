import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CloudData } from "angular-tag-cloud-module";
import { AnalysisDatabaseService } from "../analysis-database-service/analysis.database.service";

@Injectable({
  providedIn: "root",
})
export class WordcloudService {
  // private cData: CloudData[] = [];
  // private
  constructor(private http: HttpClient, private db: AnalysisDatabaseService) {}

  async createCloud(id: string) {
    let cData = new Array<CloudData>();
    let data = await this.db.getTfidfVal(id, 15, true);
    let tfidfData = data[0] as [];
    let tfIdfVal = tfidfData["tfidf"] as [];
    tfIdfVal.map((v) => {
      cData.push({
        text: v[0],
        weight: v[1],
      });
    });
    return cData;
  }
}
