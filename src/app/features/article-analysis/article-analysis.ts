import { Component, OnInit } from "@angular/core";
import { AnalysisOption } from "src/app/core/enums/analysis-option";
import { ChartOption } from "src/app/core/enums/chart-option";
import { PaginationModel } from "src/app/core/models/pagination.model";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service";
import { UserSavedDocumentService } from "src/app/core/services/user-saved-document-service/user-saved-document.service";

const keywordIconUrl: string = "../../../assets/icons/keyword-analysis";
const relatedIconUrl: string = "../../../assets/icons/related-doc";
const doughnutIconUrl: string = "../../../assets/icons/chart-doughnut";
const barIconUrl: string = "../../../assets/icons/chart-bar";
const lineIconUrl: string = "../../../assets/icons/chart-line-graph";
const wordcloudIconUrl: string = "../../../assets/icons/chart-word-cloud";

@Component({
  selector: "app-article-analysis",
  templateUrl: "./article-analysis.html",
  styleUrls: ["./article-analysis.less"],
})
export class ArticleAnalysisComponent implements OnInit {

  private _isChartLoaded = false;
  private _isSavedDocsLoaded = false;
  private _savedDocs: Array<{ title: string; id: string; }>;
  private _selectedChartType: ChartOption;
  private _selectedAnalysisType: AnalysisOption;
  private _selectedDataNum: number;
  private _analysisDocIdsList: Array<string> = [];
  private _pageInfo: PaginationModel;
  private _totalSavedDocsNum: number;
  private _iconUrls: Array<string> = [keywordIconUrl, relatedIconUrl, doughnutIconUrl, lineIconUrl, wordcloudIconUrl, barIconUrl];
  private _currentPage: number;
  private _pages: number[];
  private _isSavedDocsEmpty: boolean;

  constructor(
    private paginationService: PaginationService,
    private userSavedDocumentService: UserSavedDocumentService
  ) { }

  ngOnInit(): void {
    this.selectedDataNum = 0;
    this.loadSavedDocs(1);
    this.initializeSettings();
  }

  /**
   * @description Load saved documents from userSavedDocumentService
   * @param pageNum 
   */
  async loadSavedDocs(pageNum: number): Promise<void> {
    this.isSavedDocsLoaded = false;
    this.totalSavedDocsNum = await this.userSavedDocumentService.getTotalDocNum();
    this.isSavedDocsEmpty = (this.totalSavedDocsNum === 0);
    if (this.isSavedDocsEmpty) return;
    pageNum = this.handlePageOverflow(pageNum);
    this.currentPage = pageNum;
    this.savedDocs = await this.userSavedDocumentService.getMyDocs(pageNum);
    this.pageInfo = await this.paginationService.paginate(pageNum, this.totalSavedDocsNum, 10, 3);
    this.pages = this.pageInfo.pages;
    this.isSavedDocsLoaded = true;
  }

  /**
   * @description Helper function for page number to handle the page overflow 
   * @param pageNum 
   */
  handlePageOverflow(pageNum: number): number {
    if (pageNum < 0) pageNum = 1;
    else if (pageNum * 10 > this.totalSavedDocsNum) pageNum = this.totalSavedDocsNum / 10;
    return pageNum;
  }

  /**
   * @description Reset the analysis settings 
   */
  initializeSettings() {
    this.resetSelections();
    this.analysisDocIdsList = [];
    this.isChartLoaded = false;
  }

  selectedStyleObject(flag: boolean, backgroundIdx: number): Object {
    if (backgroundIdx == null && flag) return {
      "color": "white",
      "background-color": "#0FBAFF",
      "border": "none",
      "font-weight": "700",
    }
    else if (backgroundIdx == null && !flag) return {
      "color": "black",
      "background-color": "white",
    }
    else if (flag) {
      return {
        "color": "white",
        "background-color": "#0FBAFF",
        "border": "none",
        "font-weight": "700",
        "background-image": "url(" + this.iconUrls[backgroundIdx] + "-white.png" + ")"
      };
    } else {
      return {
        "color": "black",
        "background-color": "white",
        "background-image": "url(" + this.iconUrls[backgroundIdx] + ".png" + ")"
      };
    }
  }

  /**
   * @description Set the chart type as input 
   * @param type 
   */
  setChartType(type: ChartOption): void {
    this.selectedChartType = type;
  }

  /**
   * @description Set the analysis type as input
   * @param type 
   */
  setAnalysisType(type: AnalysisOption): void {
    this.selectedAnalysisType = type;
  }

  /**
   * @description Set the number of selected data as input
   * @param num 
   */
  setSelectedDataNum(num: number): void {
    this.selectedDataNum = num;
  }

  /**
   * @description Reset the selected setting 
   */
  resetSelections(): void {
    this.selectedAnalysisType = null;
    this.selectedChartType = null;
    this.selectedDataNum = 0;
  }

  /**
   * @description Add selected documents to analysis document list
   * @param idx 
   */
  addDocToAnalysis(idx: number) {
    this.analysisDocIdsList.push(this.savedDocs[idx].id);

  }

  generateChartAnalysisResult(): void { }

  generateWordCloud() { }

  // getters and setters
  public get isChartLoaded() {
    return this._isChartLoaded;
  }
  public set isChartLoaded(value) {
    this._isChartLoaded = value;
  }
  public get isSavedDocsLoaded() {
    return this._isSavedDocsLoaded;
  }
  public set isSavedDocsLoaded(value) {
    this._isSavedDocsLoaded = value;
  }
  public get savedDocs(): Array<{ title: string; id: string; }> {
    return this._savedDocs;
  }
  public set savedDocs(value: Array<{ title: string; id: string; }>) {
    this._savedDocs = value;
  }
  public get selectedChartType(): ChartOption {
    return this._selectedChartType;
  }
  public set selectedChartType(value: ChartOption) {
    this._selectedChartType = value;
  }
  public get selectedAnalysisType(): AnalysisOption {
    return this._selectedAnalysisType;
  }
  public set selectedAnalysisType(value: AnalysisOption) {
    this._selectedAnalysisType = value;
  }
  public get selectedDataNum(): number {
    return this._selectedDataNum;
  }
  public set selectedDataNum(value: number) {
    this._selectedDataNum = value;
  }
  public get analysisDocIdsList(): Array<string> {
    return this._analysisDocIdsList;
  }
  public set analysisDocIdsList(value: Array<string>) {
    this._analysisDocIdsList = value;
  }
  public get pageInfo(): PaginationModel {
    return this._pageInfo;
  }
  public set pageInfo(value: PaginationModel) {
    this._pageInfo = value;
  }
  public get totalSavedDocsNum(): number {
    return this._totalSavedDocsNum;
  }
  public set totalSavedDocsNum(value: number) {
    this._totalSavedDocsNum = value;
  }
  public get iconUrls(): Array<string> {
    return this._iconUrls;
  }
  public set iconUrls(value: Array<string>) {
    this._iconUrls = value;
  }
  public get currentPage(): number {
    return this._currentPage;
  }
  public set currentPage(value: number) {
    this._currentPage = value;
  }
  public get pages(): number[] {
    return this._pages;
  }
  public set pages(value: number[]) {
    this._pages = value;
  }
  public get isSavedDocsEmpty(): boolean {
    return this._isSavedDocsEmpty;
  }
  public set isSavedDocsEmpty(value: boolean) {
    this._isSavedDocsEmpty = value;
  }
}
