import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BodyContainerComponent } from './body-container/body-container.component';
import { BodyRoutingModule } from "./body-routing.module";
import { CommonSearchBarModule } from './shared-modules/search-bar/common-search-bar.module';
import { CommonSearchResultDocumentListModule } from './shared-modules/documents/documents.module';
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
  providers: [
    //   IdControlService
  ]
})
export class BodyModule { }
