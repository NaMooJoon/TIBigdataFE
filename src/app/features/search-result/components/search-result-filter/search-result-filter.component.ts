import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ElasticsearchService } from "src/app/core/services/elasticsearch-service/elasticsearch.service";

@Component({
  selector: "app-search-result-filter",
  templateUrl: "./search-result-filter.component.html",
  styleUrls: ["./search-result-filter.component.less"],
})
export class SearchResultFilterComponent implements OnInit, OnDestroy {
  public topics = [
    "전체",
    "정치",
    "경제",
    "사회",
    "문화",
    "국제",
    "지역",
    "스포츠",
  ];

  private institutionList: Array<Object>;
  private articleSubscriber: Subscription;
  private selectedInst: string;
  constructor(private elasticSearchService: ElasticsearchService) {
    this.articleSubscriber = this.elasticSearchService
      .getArticleChange()
      .subscribe(() => {
        this.loadInstitutions();
      });
  }

  ngOnInit() { }

  ngOnDestroy() {
    this.articleSubscriber.unsubscribe();
  }

  async loadInstitutions() {
    let res = await this.elasticSearchService.getInstitutionsWithTextSearch();
    this.institutionList = res["aggregations"]["count"]["buckets"];
  }

  selectedStyleObject(flag: boolean): Object {
    if (flag) {
      return {
        color: "white",
        "background-color": "#0FBAFF",
        border: "none",
      };
    } else {
      return {
        color: "black",
        "background-color": "white",
      };
    }
  }

  selectInst(inst: { key: string; doc_num: number }) {
    this.selectedInst = inst.key;
  }
}
