import { Component, OnInit } from "@angular/core";
import { UserDocumentService } from "src/app/modules/communications/fe-backend-db/userDocument/userDocument.service";
import { PaginationModel } from "../../shared-services/pagination-service/pagination.model";
import { PaginationService } from "../../shared-services/pagination-service/pagination.service";

enum CHART {
  DOUGHNUT,
  LINE,
  WORDCLOUD,
  BAR,
}

enum ANALYSIS {
  KEYWORDS,
  RELATED_DOCS,
}

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.less"],
})
export class DashboardComponent implements OnInit {
  constructor(
    private paginationService: PaginationService,
    private userDocumentService: UserDocumentService
  ) {}

  private isChartLoaded = false;
  private isSavedDocsLoaded = false;
  private savedDocs: Array<{ title: string; id: string }>;
  private selectedChartType: CHART;
  private selectedAnalysisType: ANALYSIS;
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
    this.totalSavedDocsNum = await this.userDocumentService.getTotalDocNum();
    pageNum = this.handlePageOverflow(pageNum);
    this.savedDocs = await this.userDocumentService.getMyDocs(pageNum);
    this.pageInfo = await this.paginationService.paginate(
      pageNum,
      this.totalSavedDocsNum,
      10,
      3
    );

    console.log(this.pageInfo);
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

  setChartType(type: CHART): void {
    this.selectedChartType = type;
  }

  setAnalysisType(type: ANALYSIS): void {
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
    console.log(this.analysisDocIdsList);
  }

  generateChartAnalysisResult(): void {}

  generateWordCloud() {}
}
