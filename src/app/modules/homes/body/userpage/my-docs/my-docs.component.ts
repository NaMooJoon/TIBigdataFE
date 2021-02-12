import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../../communications/fe-backend-db/membership/auth.service';

@Component({
  selector: 'app-my-docs',
  templateUrl: './my-docs.component.html',
  styleUrls: ['./my-docs.component.less']
})
export class MyDocsComponent implements OnInit {

  private myDocs: string[] = [];
  private isDocEmpty: boolean = false;

  constructor(
    private _auth: AuthService,

  ) { }

  ngOnInit(): void {



  }

}
