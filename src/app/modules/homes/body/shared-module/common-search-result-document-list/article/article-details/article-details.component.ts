import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../article.interface';
import { Router } from "@angular/router";
import { IdControlService } from "../../../../search/service/id-control-service/id-control.service";
import { AnalysisDatabaseService } from "../../../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.less']
})

// TODO : This compnent seems never used. Needed to be checked
export class ArticleDetailsComponent implements OnInit {

  @Input() article: any;
  // @Input() keywords : [];
  docId: string;
  constructor(private db: AnalysisDatabaseService, public _router: Router, private idControl: IdControlService,
  ) { }
  readonly DEBUG: boolean = false;

  debug(...arg: any[]) {
    if (this.DEBUG)
      console.log(arg);
  }

  ngOnInit() {
    this.docId = this.article._id
    this.article = this.article._source;
    this.load_top_keywords();
    // if (this.article.post_date.length === 4) {
    //   this.article.post_date = this.article.post_date + "-01-01"
    // }

    if (this.article.file_download_url === undefined) {
      this.article.file_download_url = this.article.published_institution_url
    }

  }

  view_doc_detail() {
    // console.log("article detail id: ", this.docId);
    this.idControl.selecOneID(this.docId);
    this.navToDocDetail();

    // this.docId = this.article["_id"];
    // console.log(this.docId);

  }

  //   /**
  //  * @function setThisDoc
  //  * @param article_source_idx 
  //  * @param related_doc_idx 
  //  * @description 개별 문서 선택할 때 해당 문서 자세히 보는 페이지로 이동
  //  */
  // setThisDoc(article_source_idx : number, related_doc_idx: number) {
  //   console.log("set this doc : ", article_source_idx);
  //   this.idControl.setIdChosen(this.relatedDocs[article_source_idx][related_doc_idx]["id"]);
  //   this.navToDocDetail();
  // }



  //각 문서마다 들어갈 상위 키워드를 저장할 array
  private keywords: any[] = [];

  load_top_keywords() {
    // console.log("article detail load top keyword start : doc_id", this.docId, " source : ", this.article)
    this.db.getTfidfVal(this.docId).then(res => {
      this.debug("article detail res : ", res)
      let data = res as []

      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];
        this.keywords.push(tfVal)//각 문서에 상위 키워드 배열을 담는다.
      }
    })
    // console.log("article detail : keywords : ",this.keywords)
    // this.isKeyLoaded = true;  
  }



  navToDocDetail() {
    this._router.navigateByUrl("search/DocDetail");
  }



}
