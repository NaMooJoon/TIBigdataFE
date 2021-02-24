import { Component, OnInit } from "@angular/core";
import { UserSavedDocumentService } from "src/app/core/services/user-saved-document-service/user-saved-document.service";
import { PaginationModel } from "src/app/core/models/pagination.model";
import { PaginationService } from "src/app/core/services/pagination-service/pagination.service";
import { ChartOption } from "src/app/core/enums/chart-option";
import { AnalysisOption } from "src/app/core/enums/analysis-option";

@Component({
  selector: "app-article-analysis",
  templateUrl: "./article-analysis.html",
  styleUrls: ["./article-analysis.less"],
})
export class ArticleAnalysisComponent implements OnInit {
  constructor(
    private paginationService: PaginationService,
    private userSavedDocumentService: UserSavedDocumentService
  ) {}

  private isChartLoaded = false;
  private isSavedDocsLoaded = false;
  private savedDocs: Array<{ title: string; id: string }>;
  private selectedChartType: ChartOption;
  private selectedAnalysisType: AnalysisOption;
  private selectedDataNum: number;
  private analysisDocIdsList: Array<string> = [];
  private pageInfo: PaginationModel;
  private totalSavedDocsNum: number;

  ngOnInit(): void {
    this.selectedDataNum = 0;
    this.loadSavedDocs(1);
    this.initializeSettings();
  }

  async loadSavedDocs(pageNum: number): Promise<void> {
    this.isSavedDocsLoaded = false;
    this.totalSavedDocsNum = await this.userSavedDocumentService.getTotalDocNum();
    pageNum = this.handlePageOverflow(pageNum);
    this.savedDocs = await this.userSavedDocumentService.getMyDocs(pageNum);
    this.pageInfo = await this.paginationService.paginate(
      pageNum,
      this.totalSavedDocsNum,
      10,
      3
    );


    this.isSavedDocsLoaded = true;
  }

  handlePageOverflow(pageNum: number): number {
    if (pageNum < 0) pageNum = 1;
    else if (pageNum > this.totalSavedDocsNum) pageNum = this.totalSavedDocsNum;

    return pageNum;
  }

  initializeSettings() {
    this.resetSelections();
    this.analysisDocIdsList = [];
    this.isChartLoaded = false;
  }

  selectedStyleObject(flag: boolean): Object {
    if (flag) {
      return {
        color: "white",
        "background-color": "#0FBAFF",
        border: "none",
        "font-weight": "700",
      };
    } else {
      return {
        color: "black",
        "background-color": "white",
      };
    }
  }

  setChartType(type: ChartOption): void {
    this.selectedChartType = type;
  }

  setAnalysisType(type: AnalysisOption): void {
    this.selectedAnalysisType = type;
  }

  setSelectedDataNum(num: number): void {
    this.selectedDataNum = num;
  }

  resetSelections(): void {
    this.selectedAnalysisType = null;
    this.selectedChartType = null;
    this.selectedDataNum = 0;
  }

  addDocToAnalysis(idx: number) {
    this.analysisDocIdsList.push(this.savedDocs[idx].id);

  }

  generateChartAnalysisResult(): void {}

  generateWordCloud() {}
}
