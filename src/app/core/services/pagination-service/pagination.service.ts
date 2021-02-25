import { Injectable } from "@angular/core";
import { PaginationModel } from "../../models/pagination.model";

const MAX_PAGE_NUM = 5;

@Injectable({
  providedIn: "root",
})
export class PaginationService {
  async paginate(
    currentPage: number,
    totalDocs: number,
    pageSize: number,
    maxPageNum?: number
  ): Promise<PaginationModel> {
    let totalPages = Math.ceil(totalDocs / pageSize);

    if (currentPage === null) currentPage = 1;
    if (currentPage < 1) currentPage = 1;
    else if (currentPage > totalPages) currentPage = totalPages;

    if (maxPageNum === undefined) maxPageNum = MAX_PAGE_NUM;

    let startPage: number, endPage: number;
    if (totalPages <= maxPageNum) {
      startPage = 1;
      endPage = totalPages;
    } else {
      let maxPagesBeforeCurrentPage = Math.floor(maxPageNum / 2);
      let maxPagesAfterCurrentPage = Math.ceil(maxPageNum / 2) - 1;

      if (currentPage <= maxPagesBeforeCurrentPage) {
        startPage = 1;
        endPage = maxPageNum;
      } else if (currentPage + maxPagesAfterCurrentPage >= totalPages) {
        startPage = totalPages - maxPageNum + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - maxPagesBeforeCurrentPage;
        endPage = currentPage + maxPagesAfterCurrentPage;
      }
    }
    let startIndex = (currentPage - 1) * pageSize;
    let endIndex = Math.min(startIndex + pageSize - 1, totalDocs - 1);
    let pages = Array.from(Array(endPage + 1 - startPage).keys()).map(
      (i) => startPage + i
    );

    return {
      totalDocs: totalDocs,
      currentPage: currentPage,
      pageSize: pageSize,
      totalPages: totalPages,
      startPage: startPage,
      endPage: endPage,
      startIndex: startIndex,
      endIndex: endIndex,
      pages: pages,
    };
  }
}
