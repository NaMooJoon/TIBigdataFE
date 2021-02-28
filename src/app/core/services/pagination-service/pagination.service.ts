import { Injectable } from "@angular/core";
import { PaginationModel } from "../../models/pagination.model";

const MAX_PAGE_NUM = 5;

@Injectable({
  providedIn: "root",
})
export class PaginationService {
  /**
   * @description Run pagination logic to get page information.
   * @param currentPage Current page to display.
   * @param totalDocs Number of total articles to show.
   * @param pageSize Number of articles per one page 
   * @param maxPageNum Number of pages to display at once.
   * 
   * @returns [
   * totalDocs: total number of articles to display, 
      currentPage: current page to display, 
      pageSize: number of articles per page, 
      totalPages: total pages to display,
      startPage: begging number of current page number block,
      endPage: last number of current page page number block,
      startIndex: start index to search in this page number block,
      endIndex: last inedx to search in this page number block,
      pages: page numbers of current page number block,
    };
   */
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
