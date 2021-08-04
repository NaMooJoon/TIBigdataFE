import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AnalysisRoutingModule } from "./analysis-routing.module";
import { ManualComponent } from "./components/manual/manual.component";
import { PreprocessingComponent } from "./components/preprocessing/preprocessing.component";
import { AnalysisComponent } from "./components/analysis/analysis.component";
import { AnalysisMenuComponent } from "./components/analysis-menu/analysis-menu.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({
  declarations: [
    ManualComponent,
    PreprocessingComponent,
    AnalysisComponent,
    AnalysisMenuComponent,
  ],
  imports: [CommonModule, AnalysisRoutingModule, SharedModule, FileUploadModule],
})
export class AnalysisModule {}
