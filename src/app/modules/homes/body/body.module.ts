import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BodyContainerComponent } from './body-container/body-container.component';
import { BodyRoutingModule } from "./body-routing.module";
import { CommonSearchBarModule } from './shared-modules/search-bar/common-search-bar.module';
import { CommonSearchResultDocumentListModule } from './shared-modules/documents/documents.module';
import { UserpageModule } from './userpage/userpage.module';

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
})
export class BodyModule { }
