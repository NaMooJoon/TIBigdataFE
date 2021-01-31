import { Component, OnInit } from '@angular/core';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';

@Component({
  selector: 'app-my-docs',
  templateUrl: './my-docs.component.html',
  styleUrls: ['./my-docs.component.less']
})
export class MyDocsComponent implements OnInit {

  private myDocs: string[] = [];
  private isDocEmpty: boolean = false;

  constructor(
    private _auth: EPAuthService,

  ) { }

  ngOnInit(): void {
    this._auth.getLoginStatChange().subscribe((logstat) => {
      this.getKeepDocs();
    });
  }

  async getKeepDocs() {
    console.log("Getkeep odcs init")
    this.myDocs = await this._auth.getMyDocs() as string[];
    console.log(this.myDocs)
    if (this.myDocs == null) {
      this.isDocEmpty = true;
      this.myDocs = ["저장한 문서가 없어요. 검색 후 문서를 저장해보세요."];
    }
    // console.log(typeof(this.myDocs))
    // console.log(this.myDocs.length)
    // this.myDocsNum = this.myDocs.length;
  }
  
  deleteAllMyDocs() {
    console.log("문서 지우기")
    this._auth.eraseAllMyDoc().then(
      () => this.getKeepDocs()
    );

  }

}
