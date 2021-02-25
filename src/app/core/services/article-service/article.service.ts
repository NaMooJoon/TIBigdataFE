import { Injectable } from "@angular/core";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";
import { ArticleSource } from "../../models/article.model";

@Injectable({
  providedIn: "root",
})
export class ArticleService {
  private selectedId: string;
  private idList: Array<string>;
  private article: ArticleSource;

  constructor(private es: ElasticsearchService) {

  }

  async convertDocIdsToTitles(ids: string[]): Promise<string[]> {
    let docTitles: Array<string> = new Array<string>(ids.length);
    this.es.setIds(ids);
    await this.es.searchByManyId().then((res) => {
      let articles: {}[] = res["hits"]["hits"];
      for (let i = 0; i < articles.length; i++) {
        let idx = ids.indexOf(articles[i]["_id"]);
        let extractedTitle: string = articles[i]["_source"]["post_title"];
        docTitles[idx] = extractedTitle.trim();
      }
    });
    return docTitles;
  }

  clearList() {
    this.idList = [];
    this.selectedId = "";
  }

  addId(id: string) {
    this.idList.push(id);
  }

  getList() {
    return this.idList;
  }

  setSelectedId(id: string) {
    this.selectedId = id;
  }

  getSelectedId() {
    return this.selectedId;
  }

  getArticle() {
    return this.article;
  }

  setArticle(art: ArticleSource) {
    this.article = art;
  }

  getIdByIdx(index: number): string {
    return this.idList[index];
  }
}
