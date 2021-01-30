import { Injectable } from '@angular/core';
import { ElasticsearchService } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';

const MAXPAGENUM = 5;

@Injectable({
  providedIn: 'root'
})

export class PaginationService {
  private _totalDocs: number;
  private _currentPage: number;
  private _pageSize: number;
  private _totalPages: number;
  private _startPage: number;
  private _endPage: number;
  private _startIndex: number;
  private _endIndex: number;
  private _pages: number[];


  constructor(
    private _es: ElasticsearchService
  ) {
    this._currentPage = 1;
    this._pageSize = _es.getNumDocsPerPage();
  }



  paginate() {
    this._totalPages = Math.ceil(this._totalDocs / this._pageSize);
    if (this._currentPage < 1) this._currentPage = 1;
    else if (this._currentPage > this._totalPages) this._currentPage = this._totalPages;

    if (this._totalPages <= MAXPAGENUM) {
      this._startPage = 1;
      this._endPage = this._totalPages;
    }
    else {
      let maxPagesBeforeCurrentPage = Math.floor(MAXPAGENUM / 2);
      let maxPagesAfterCurrentPage = Math.ceil(MAXPAGENUM / 2) - 1;

      if (this._currentPage <= maxPagesBeforeCurrentPage) {
        this._startPage = 1;
        this._endPage = MAXPAGENUM;
      }
      else if (this._currentPage + maxPagesAfterCurrentPage >= this._totalPages) {
        this._startPage = this._totalPages - MAXPAGENUM + 1;
        this._endPage = this._totalPages;
      }
      else {
        this._startPage = this._currentPage - maxPagesBeforeCurrentPage;
        this._endPage = this._currentPage + maxPagesAfterCurrentPage;
      }
    }
    this._startIndex = (this._currentPage - 1) * this._pageSize;
    this._endIndex = Math.min(this._startIndex + this._pageSize - 1, this._totalDocs - 1);
    this._pages = Array.from(Array((this._endPage + 1) - this._startPage).keys()).map(i => this._startPage + i);
  }


  loadSelectedPage(selectedPageNum: number) {
    this._currentPage = selectedPageNum;
    this._es.fullTextSearchComplete((this._currentPage - 1) * this._es.getNumDocsPerPage());
  }

  loadPriorPage() {
    this._currentPage--;
    this.loadSelectedPage(this._currentPage);
  }

  loadNextPage() {
    this._currentPage++;
    this.loadSelectedPage(this._currentPage);
  }

  loadNextTenPage() {
    this._currentPage += 10;
    this.loadSelectedPage(this._currentPage);
  }

  loadPriorTenPage() {
    this._currentPage -= 10;
    if (this._currentPage < 1) this._currentPage = 1;
    this.loadSelectedPage(this._currentPage);
  }

  setCurrentPage(currentPage: number) {
    this._currentPage = currentPage;
    this.loadSelectedPage(this._currentPage);
  }

  getCurrentPage() {
    return this._currentPage;
  }

  getTotalPage() {
    return this._totalPages;
  }

  getPages() {
    return this._pages;
  }

  async loadPage() {
    this._totalDocs = await this._es.getCountNumber();
    this._pageSize = this._es.getNumDocsPerPage();
    this.paginate();
  }
}

