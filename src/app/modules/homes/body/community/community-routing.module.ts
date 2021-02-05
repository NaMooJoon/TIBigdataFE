import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommunityRootComponent } from './community-root/community-root.component';
import { QnaComponent } from './qna/qna.component';
import { WriteNewCommunityDocComponent } from './write-new-community-doc/write-new-community-doc.component';
import { ReadCommunityDocComponent } from "./read-community-doc/read-community-doc.component";
import { AnnouncementComponent } from "./announcement/announcement.component";
import { FAQComponent } from "./faq/faq.component";
import { CommunityService } from './community-services/community.service';

const routes: Routes = [
  {
    path: "",
    component: CommunityRootComponent,
    children: [
      {
        path: "qna",
        component: QnaComponent
      },
      {
        path: "newDoc",
        component: WriteNewCommunityDocComponent
      },
      {
        path: "readDoc",
        component: ReadCommunityDocComponent
      },
      {
        path: "announcement",
        component: AnnouncementComponent
      },
      {
        path: "faq",
        component: FAQComponent
      },

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule { }
