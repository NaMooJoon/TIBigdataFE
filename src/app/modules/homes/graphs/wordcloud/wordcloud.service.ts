import { Injectable } from "@angular/core";
// import { IdControlService } from "../../";
import { HttpClient } from "@angular/common/http";
import { CloudData, CloudOptions } from "angular-tag-cloud-module";
import { AnalysisDatabaseService } from "../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";
// communications/fe-backend-db/analysis-db/database.service";

@Injectable({
  providedIn: "root"
})
export class WordcloudService {
  // private cData: CloudData[] = [];
  // private
  constructor(private http: HttpClient, private db: AnalysisDatabaseService) { }

  async createCloud(id: string) {
    let cData = new Array<CloudData>();
    let data = await this.db.get_tfidf_value(id, 15, true);
    // console.log("wordClud res : ", data);

    let tfidfData = data[0] as [];
    let tfIdfVal = tfidfData["tfidf"] as [];
    tfIdfVal.map(v => {
      cData.push({
        text: v[0],
        weight: v[1]
      })
      // console.log("service cData : " + cData);

    })
    return cData;
  }
}
