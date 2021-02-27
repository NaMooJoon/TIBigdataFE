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

  constructor(private elasticsearchService: ElasticsearchService) { }

  /**
   * @description get list of article ids collected by ES search and convery them into list of article titles.
   * @param ids list of ids in string
   * @returns list of article titles 
   */
  async convertDocIdsToTitles(ids: string[]): Promise<string[]> {
    let docTitles: Array<string> = new Array<string>(ids.length);
    this.elasticsearchService.setIds(ids);
    await this.elasticsearchService.searchByManyId().then((res) => {
      let articles: {}[] = res["hits"]["hits"];
      for (let i = 0; i < articles.length; i++) {
        let idx = ids.indexOf(articles[i]["_id"]);
        let extractedTitle: string = articles[i]["_source"]["post_title"];
        docTitles[idx] = extractedTitle.trim();
      }
    });
    return docTitles;
  }

  /**
   * @description clear current list of articles
   */
  clearList(): void {
    this.idList = [];
    this.selectedId = "";
  }

  /**
   * @description add article id into current list of articles 
   * @param id 
   */
  addId(id: string): void {
    this.idList.push(id);
  }

  /**
   * @description get current list of articles 
   * @returns list of article ids in string
   */
  getList(): Array<string> {
    return this.idList;
  }

  /**
   * @description update current selected id
   * @param id article id from ES that user wants to select
   */
  setSelectedId(id: string): void {
    this.selectedId = id;
  }

  /**
   * @description get currently selected article's id
   * @returns article id that user chose
   */
  getSelectedId(): string {
    return this.selectedId;
  }

  /**
   * @description get ArticleSource that holds all articles of search result
   * @returns article source
   */
  getArticle(): ArticleSource {
    return this.article;
  }

  /**
   * @description update article source that will be controlled by this service 
   * @param art article source
   */
  setArticle(article: ArticleSource) {
    this.article = article;
  }

  /**
   * @description when index passed, return the article that located in the index from list of article ids.
   * @param index 
   * @returns selected id from article id list
   */
  getIdByIdx(index: number): string {
    return this.idList[index];
  }
}
