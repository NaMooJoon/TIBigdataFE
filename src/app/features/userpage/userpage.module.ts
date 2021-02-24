import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MemberInfoComponent } from "./components/member-info/member-info.component";
import { MyAnalysisComponent } from "./components/my-analysis/my-analysis.component";
import { MyDocsComponent } from "./components/my-docs/my-docs.component";
import { SecessionComponent } from "./components/secession/secession.component";
import { UserpageRoutingModule } from "./userpage-routing.module";
import { UserpageRootComponent } from './components/userpage-root/userpage-root.component';

@NgModule({
  declarations: [
    UserpageRootComponent,
    MyDocsComponent,
    MyAnalysisComponent,
    MemberInfoComponent,
    SecessionComponent,
  ],
  imports: [CommonModule, UserpageRoutingModule],
})
export class UserpageModule {}
