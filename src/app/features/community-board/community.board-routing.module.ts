import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/core/guards/auth-guard/auth.guard";
import { AnnouncementComponent } from "./components/board-announcement/board.annoucement.component";
import { QnaComponent } from "./components/board-qna/board.qna.component";
import { FaqComponent } from "./components/board-faq/board.faq.component";
import { CommunityBoardComponent } from "./components/community-board-root/community.board.component";
import { DocumentWriteComponent } from "./components/document-write/document.write.component";
import { DocumentReadComponent } from "./components/document-read/document.read.component";
import { DocumentModifyComponent } from "./components/document-modify/document.modify.component";

const routes: Routes = [
  {
    path: "",
    component: CommunityBoardComponent,
    children: [
      {
        path: "qna",
        component: QnaComponent,
      },
      {
        path: "announcement",
        component: AnnouncementComponent,
      },
      {
        path: "faq",
        component: FaqComponent,
      },
      {
        path: "announcement/modify",
        component: DocumentModifyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "qna/modify",
        component: DocumentModifyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "faq/modify",
        component: DocumentModifyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "announcement/new",
        component: DocumentWriteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "qna/new",
        component: DocumentWriteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "faq/new",
        component: DocumentWriteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "announcement/read",
        component: DocumentReadComponent,
      },
      {
        path: "qna/read",
        component: DocumentReadComponent,
      },
      {
        path: "faq/read",
        component: DocumentReadComponent,
      },
    ],

  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CommunityRoutingModule { }
