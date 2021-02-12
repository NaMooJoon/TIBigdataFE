import { Component, OnInit } from '@angular/core';
import { UserDocumentService } from 'src/app/modules/communications/fe-backend-db/userDocument/userDocument.service';
import { AuthService } from '../../../../communications/fe-backend-db/membership/auth.service';

@Component({
  selector: 'app-my-analysis',
  templateUrl: './my-analysis.component.html',
  styleUrls: ['./my-analysis.component.less']
})
export class MyAnalysisComponent implements OnInit {

  private myDocs: Array<{ title: string, id: string }>;
  private isDocEmpty: boolean = false;

  constructor(
    private _auth: AuthService,
    private userDocumentService: UserDocumentService,

  ) { }

  ngOnInit(): void {
    this.getKeepDocs();
  }

  async getKeepDocs() {
    this.myDocs = await this.userDocumentService.getMyDocs();
  }
}
