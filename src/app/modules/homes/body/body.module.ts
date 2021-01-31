import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BodyContainerComponent } from './body-container/body-container.component';
import { BodyRoutingModule } from "./body-routing.module";
import { CommonSearchBarModule } from './shared-module/common-search-bar/common-search-bar.module';
import { CommonSearchResultDocumentListModule } from './shared-module/common-search-result-document-list/common-search-result-document-list.module';
import { UserpageModule } from './userpage/userpage.module';

// import { IdControlService } from './search/service/id-control-service/id-control.service';

@NgModule({
  declarations: [
    BodyContainerComponent,
  ],
  imports: [
    CommonModule,
    CommonSearchBarModule,
    BodyRoutingModule,
    CommonSearchResultDocumentListModule,
    FormsModule,
    ReactiveFormsModule,
    UserpageModule,
  ],
  exports: [
    // SearchResultComponent,
    // SearchBarComponent
  ],
  // providers:[
  //   IdControlService
  // ]
})
export class BodyModule { }
