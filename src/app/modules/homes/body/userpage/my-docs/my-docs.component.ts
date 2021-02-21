import { Component, OnInit } from '@angular/core';
import { ArticleSource } from "../../../body/shared-modules/documents/article.interface";
import { AuthService } from '../../../../communications/fe-backend-db/membership/auth.service';
import { PaginationService } from "src/app/modules/homes/body/shared-services/pagination-service/pagination.service"
import { DocumentService } from 'src/app/modules/homes/body/shared-services/document-service/document.service';
import { UserDocumentService } from '../../../../communications/fe-backend-db/userDocument/userDocument.service';
import { PaginationModel } from "../../shared-services/pagination-service/pagination.model";
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";

@Component({
  selector: 'app-my-docs',
  templateUrl: './my-docs.component.html',
  styleUrls: ['./my-docs.component.less']
})
export class MyDocsComponent implements OnInit {

  form: FormGroup;

  private articleSources: ArticleSource[];
  private RelatedDocBtnToggle: Array<boolean>;

  constructor(
    private _auth: AuthService,
    private paginationService: PaginationService,
    private userDocumentService: UserDocumentService,
    private documentService: DocumentService,
    private formBuilder: FormBuilder,
  ) { 

    this.setCheckbox();

  }

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

  setArticleIdList(): void {
    this.RelatedDocBtnToggle = [];
    for (var i in this.articleSources) {
      this.documentService.addId(this.articleSources[i]["_id"]);
      this.RelatedDocBtnToggle.push(false);
    }
  }

  setArticleForm(): void {
    this.form = this.formBuilder.group({
      checkArray: this.formBuilder.array([]),
    });
  }

  setCheckbox(): void {
    for (let i in this.articleSources) {
      this.articleSources[i]["isSelected"] = false;
    }
  }

  checkUncheckAll(isCheckAll: boolean, checkArray: FormArray): FormArray {
    if (isCheckAll) {
      for (let i = 0; i < this.articleSources.length; i++) {
        checkArray.push(new FormControl(this.articleSources[i]["_id"]));
      }
    } else {
      checkArray.clear();
    }

    for (let i = 0; i < this.articleSources.length; i++) {
      this.articleSources[i]["isSelected"] = isCheckAll;
    }

    return checkArray;
  }

  onCheckboxChange(e): void {
    let checkArray: FormArray = this.form.get("checkArray") as FormArray;
    if (e.target.value === "toggleAll") {
      checkArray = this.checkUncheckAll(e.target.checked, checkArray);
    } else {
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

  deleteAllMyDocs() {
    console.log("문서 지우기")
    this.userDocumentService.eraseAllMyDocs().then(
      () => this.loadSavedDocs(1)
    );

  }

}
