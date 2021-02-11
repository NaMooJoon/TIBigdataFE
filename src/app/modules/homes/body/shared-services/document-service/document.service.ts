import { Injectable } from '@angular/core';
import { ElasticsearchService } from "src/app/modules/communications/elasticsearch-service/elasticsearch.service"
import { ArticleSource } from '../../shared-modules/documents/article.interface';


@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private oneID: string = "";
  private idList: string[] = [];
  private article: ArticleSource;

  constructor(
    private es: ElasticsearchService,
  ) { }

  async convertDocIdsToTitles(ids: string[]): Promise<string[]> {
    let docTitles: Array<string> = new Array<string>(ids.length);
    this.es.setIds(ids);
    await this.es.searchByManyId().then(res => {
      let articles: {}[] = res["hits"]["hits"];
      for (let i = 0; i < articles.length; i++) {
        let idx = ids.indexOf(articles[i]['_id']);
        let extractedTitle: string = articles[i]['_source']['post_title'];
        docTitles[idx] = extractedTitle.trim();
      }
    });
    return docTitles;
  }

  clearAll() {
    this.idList = [];
    this.oneID = "";
  }

  pushIDList(id: string) {
    this.idList.push(id);
  }

  popIDList() {
    this.idList.pop();
  }

  clearIDList() {
    this.idList = [];
  }

  getIDList() {
    return this.idList;
  }

  clearIds() {
    this.idList = [];
  }

  selectOneID(id: string) {
    this.oneID = id;
  }

  getOneID() {
    return this.oneID;
  }

  clearOneID() {
    this.oneID = "";
  }

  getArticle() {
    return this.article;
  }

  setArticle(art: ArticleSource) {
    this.article = art;
  }
}
