import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ElasticsearchService, SEARCHMODE } from 'src/app/modules/communications/elasticsearch-service/elasticsearch.service';
import { PaginationModel } from './pagination.model';

const MAXPAGENUM = 5;

@Injectable({
  providedIn: 'root'
})

export class PaginationService {
  private countNumChange$: Observable<any> = this._es.getCountNumChange();
  private countNumSubs: Subscription;


  constructor(
    private _es: ElasticsearchService

  ) {
  }

  async paginate(currentPage: number, totalDocs: number, pageSize: number): Promise<PaginationModel> {
    if (pageSize === null) pageSize = this._es.getNumDocsPerPage();

    if (currentPage === null) currentPage = 1;

    let totalPages = Math.ceil(totalDocs / pageSize);
    if (currentPage < 1) currentPage = 1;
    else if (currentPage > totalPages) currentPage = totalPages;

    let startPage: number, endPage: number;
    if (totalPages <= MAXPAGENUM) {
      startPage = 1;
      endPage = totalPages;
    }
    else {
      let maxPagesBeforeCurrentPage = Math.floor(MAXPAGENUM / 2);
      let maxPagesAfterCurrentPage = Math.ceil(MAXPAGENUM / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = MAXPAGENUM;
      }
      else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - MAXPAGENUM + 1;
        endPage = totalPages;
      }
      else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalDocs - 1);
    let pages = Array.from(Array((endPage + 1) - startPage).keys()).map(i => startPage + i);

    return {
      totalDocs: totalDocs,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages
    };
  }
}

