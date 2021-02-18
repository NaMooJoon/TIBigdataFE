import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { PaginationService } from "src/app/modules/homes/body/shared-services/pagination-service/pagination.service"
import { DocumentService } from 'src/app/modules/homes/body/shared-services/document-service/document.service';
import { UserDocumentService } from '../../../../communications/fe-backend-db/userDocument/userDocument.service';
import { PaginationModel } from "../../shared-services/pagination-service/pagination.model";

@Component({
  selector: 'app-my-docs',
  templateUrl: './my-docs.component.html',
  styleUrls: ['./my-docs.component.less']
})
export class MyDocsComponent implements OnInit {

  constructor(
    private _auth: AuthService,
    private paginationService: PaginationService,
    private userDocumentService: UserDocumentService,
  ) { }

  private isSavedDocsLoaded = false;
  private savedDocs: Array<{ title: string; id: string }>;
  private pageInfo: PaginationModel;
  private totalSavedDocsNum: number;

  ngOnInit(): void {

    this.loadSavedDocs(1);

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

}
