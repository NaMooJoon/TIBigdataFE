import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OpenApiRoutingModule } from "./open-api-routing.module";
import { ManagementComponent } from "./components/management/management.component";
import { DocumentComponent } from "./components/document/document.component";
import { GotoapiComponent } from "./components/gotoapi/gotoapi.component";
import { OpenApiMenuComponent } from "./components/open-api-menu/open-api-menu.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [
    ManagementComponent,
    DocumentComponent,
    GotoapiComponent,
    OpenApiMenuComponent,
  ],
  imports: [CommonModule, OpenApiRoutingModule, SharedModule],
})
export class OpenApiModule {}
