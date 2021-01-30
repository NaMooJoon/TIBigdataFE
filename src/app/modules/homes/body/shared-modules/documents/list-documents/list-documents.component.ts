import { Component, OnInit, Input, OnChanges, Output, EventEmitter, OnDestroy, } from "@angular/core";
import { Router } from "@angular/router";
import { ElasticsearchService, SEARCHMODE } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { ArticleSource } from "../article/article.interface";
import { Subscription, Observable } from "rxjs";
import { IdControlService } from "src/app/modules/homes/body/shared-services/id-control-service/id-control.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { DocumentService } from "src/app/modules/homes/body/shared-services/document-service/document.service";
import { IpService } from "src/app/ip.service";
import { RecommendationService } from "src/app/modules/homes/body/shared-services/recommendation-service/recommendation.service";
import { EPAuthService } from '../../../../../communications/fe-backend-db/membership/auth.service';
import { EventService } from "../../../../../communications/fe-backend-db/membership/event.service";
import { AnalysisDatabaseService } from "../../../../../communications/fe-backend-db/analysis-db/analysisDatabase.service";
import { FormBuilder, FormGroup, FormArray, FormControl, Validators, Form } from '@angular/forms';
import { PaginationService } from "src/app/modules/homes/body/shared-services/pagination-service/pagination.service"
import { select } from "d3-selection";

@Component({
  selector: 'app-search-result-document-list',
  templateUrl: './list-documents.component.html',
  styleUrls: ['./list-documents.component.less']
})

export class ListDocumentsComponent implements OnInit, OnDestroy {
  orders = ['최신순', '과거순'];
  amounts = [10, 30, 50];
  form: FormGroup;

  @Input() isKeyLoaded: boolean;//키워드 검색으로 진입할 때
  @Output() relatedKeywordsReady = new EventEmitter<string[]>();//현재 검색어의 연관문서 완료되었을 때
  private ResultIdList: string[] = [];
  private selectedDocs: string[] = [];
  private relatedDocs: ArticleSource[][] = [];

  // private keywordChange$ : Observable<string> = this.es.getKeywordChange();
  private countNumChange$: Observable<any> = this.es.getCountNumChange();
  private articleChange$: Observable<ArticleSource[]> = this.es.getArticleChange();
  private loginStatChage$ = this.auth.getLoginStatChange();

  // private keywordSubs : Subscription;
  private countNumSubs: Subscription;
  private articleSubs: Subscription;
  private loginStatSubs: Subscription;
  private articleSources: ArticleSource[];

  private RelatedDocBtnToggle: Array<boolean>;
  private isResultFound = false;
  private isLogStat: Number = 0;
  private isQueryFin: boolean = false;
  private searchResultNum: string = "0";
  private numDocsPerPages: number = this.es.getNumDocsPerPage();
  private pages: number[] = [];
  private currentPage: number = 1;
  private selectedPageNum: number = 1;
  private maxPageNum: number = 9;

  private queryText: string;

  constructor(
    private auth: EPAuthService,
    private evtSvs: EventService,
    private rcmd: RecommendationService,
    private ipService: IpService,
    private idControl: IdControlService,
    public _router: Router,
    private http: HttpClient,
    private es: ElasticsearchService, //private cd: ChangeDetectorRef.
    private db: AnalysisDatabaseService,
    private docControl: DocumentService,
    private fb: FormBuilder,
    private pgService: PaginationService,
  ) {
  }

  ngOnDestroy() {
    this.loginStatSubs.unsubscribe();
    this.articleSubs.unsubscribe();
    this.countNumSubs.unsubscribe();
  }

  ngOnInit() {
    this.isResultFound = false;
    this.isQueryFin = false;
    this.loadSearchResult();
  }

  update_login_stat() {
    this.loginStatSubs = this.loginStatChage$.subscribe(stat => {
      this.isLogStat = stat;
    })
  }

  setCheckboxProp(): void {
    for (let i in this.articleSources) {
      this.articleSources[i]['isSelected'] = false;
    }
  }

  async loadSearchResult() {
    this.initialize_search();
    this.articleSubs = this.articleChange$.subscribe(articles => {
      this.articleSources = articles
      this.createResultIdList();
      this.pgService.loadPage();
      this.setCheckboxProp();
      this.loadRelatedKeywords();
      this.form = this.fb.group({
        checkArray: this.fb.array([])
      })

      if (this.articleSources !== undefined) this.isResultFound = true;
      else this.isResultFound = false;
    });

    this.countNumSubs = this.countNumChange$.subscribe(num => {
      this.queryText = this.es.getKeyword();
      this.searchResultNum = this.convertNumberFormat(num);
    })
    this.update_login_stat();
  }

  convertNumberFormat(num: number): string {
    let docCount: string = num.toString();
    if (num === 0) return docCount;

    return docCount.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  searchAgain(num: number) {
    this.es.setNumDocsPerPage(num);
    this.es.setSearchMode(SEARCHMODE.KEY);
    this.es.searchKeyword(this.queryText);
    this.articleSubs.unsubscribe();
    this.countNumSubs.unsubscribe();
    this.ngOnInit();
  }

  initialize_search() {
    this.isResultFound = false;
    this.idControl.clearIDList();
    this.ResultIdList = [];
    this.selectedDocs = [];
  }

  createResultIdList() {
    this.RelatedDocBtnToggle = [];
    for (var i in this.articleSources) {
      this.ResultIdList[i] = this.articleSources[i]["_id"];
      this.RelatedDocBtnToggle.push(false);
    }
    console.log("result id list: ", this.ResultIdList)
  }

  openSelectedDoc(articleSourceIdx: number, RelatedDocIdx: number) {
    this.idControl.selectOneID(this.relatedDocs[articleSourceIdx][RelatedDocIdx]["id"]);
    this.navToDocDetail();
  }

  openRelatedDocList(i: number) {
    this.loadRelatedDocs(i); //load from flask
    this.RelatedDocBtnToggle[i] = !this.RelatedDocBtnToggle[i];
  }

  loadRelatedDocs(idx: number) {
    this.db.loadRelatedDocs(this.ResultIdList[idx]).then(res => {
      this.relatedDocs[idx] = res as [];
    });
  }

  loadRelatedKeywords() {
    let relatedKeywords: string[] = [];
    this.db.getTfidfVal(this.ResultIdList).then(res => {
      let data = res as []
      for (let n = 0; n < data.length; n++) {
        let tfVal = data[n]["tfidf"];
        if (relatedKeywords.length < 7 && tfVal[0] !== this.queryText && !relatedKeywords.includes(tfVal[0]))
          relatedKeywords.push(tfVal[0])
      }
      this.exportRelatedKeywords(relatedKeywords)
    })
    this.isKeyLoaded = true;
  }

  exportRelatedKeywords(relatedKeywords: string[]) {
    this.relatedKeywordsReady.emit(relatedKeywords);
  }

  saveSelectedDocs() {
    if (this.form.value['checkArray'].length == 0) {
      alert("담을 문서가 없습니다! 담을 문서를 선택해주세요.")
    } else {
      this.auth.addMyDoc(this.form.value['checkArray']).then(() => {
        alert("문서가 나의 문서함에 저장되었어요.")
      });
    }
  }

  checkUncheckAll(isCheckAll: boolean, checkArray: FormArray) {
    if (isCheckAll) {
      for (let i = 0; i < this.articleSources.length; i++) {
        checkArray.push(new FormControl(this.articleSources[i]['_id']));
      }
    }
    else {
      checkArray.clear();
    }

    for (let i = 0; i < this.articleSources.length; i++) {
      this.articleSources[i]['isSelected'] = isCheckAll;
    }

    return checkArray
  }

  onCheckboxChange(e) {
    let checkArray: FormArray = this.form.get('checkArray') as FormArray;
    if (e.target.value === "toggleAll") {
      console.log('toggle');
      checkArray = this.checkUncheckAll(e.target.checked, checkArray);
    }
    else {
      if (e.target.checked) {
        checkArray.push(new FormControl(e.target.value));
      } else {
        let i: number = 0;
        checkArray.controls.forEach((item: FormControl) => {
          if (item.value == e.target.value) {
            checkArray.removeAt(i);
            return;
          }
          i++;
        });
      }
    }
  }

  view_doc_detail(docId: string) {
    console.log("article detail id: ", docId);
    this.idControl.selectOneID(docId);
    this.navToDocDetail();
  }

  navToDocDetail() {
    this._router.navigateByUrl("search/DocDetail");
  }
}