import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDocumentListComponent } from './search-result-document-list/search-result-document-list.component';
import { ArticleDetailsComponent } from './article/article-details/article-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    SearchResultDocumentListComponent,
    ArticleDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [
    SearchResultDocumentListComponent
  ]
})
export class CommonSearchResultDocumentListModule { }
