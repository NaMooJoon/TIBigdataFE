import { Injectable } from '@angular/core';
import { ElasticsearchService } from "src/app/modules/communications/elasticsearch-service/elasticsearch.service"


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private myDocsTitles: string[] = [];

  constructor(private es: ElasticsearchService,
  ) { }

  //user page ts에도 동일한 함수 있음. 차후 idList ts으로 이동하여 합침.
  /**
   * @description id string array을 받아서 해당 id을 문서 제목에 매핑하는 함수
   * @param ids 가 없으면 현재 유저의 myDoc을 받아온다. ids가 있으면 param으로 받은 문서 가져옴
   */
  async convert_id_to_doc_title(ids: string[]): Promise<string[]> {
    console.log("in documentn converid 2 table :  ", ids)
    this.es.setIds(ids);
    return new Promise((resolve) => {
      this.es.searchByManyId().then(res => {
        let articles = res["hits"]["hits"];
        console.log("in document : articies : ", articles)
        console.log("article len" + articles.length);
        try {
          for (let i = 0; i < articles.length; i++) {
            console.log("i = ", i);
            var id = articles[i]["_id"];
            var idx = ids.indexOf(id);
            var title = articles[i]["_source"]["post_title"];

            if (typeof (title) == "string")
              this.myDocsTitles[idx] = title;
            else if (Array.isArray(title))
              this.myDocsTitles[idx] = title[0];
          }
        }
        catch {
          console.log("error in document convert id 2 table")
        }
        console.log("myDocsTitles len : ", this.myDocsTitles.length);
        console.log("in document : myDocsTitles", this.myDocsTitles);
        resolve(this.myDocsTitles);
      })
      // this.http.post<any>()
    })
  }
}
