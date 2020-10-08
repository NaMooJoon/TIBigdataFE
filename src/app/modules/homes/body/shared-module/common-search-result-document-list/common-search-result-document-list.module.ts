import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchResultDocumentListComponent } from './search-result-document-list/search-result-document-list.component';
import { ArticleDetailsComponent } from './article/article-details/article-details.component';
@NgModule({
  declarations: [
    SearchResultDocumentListComponent,
    ArticleDetailsComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SearchResultDocumentListComponent
  ]
})
export class CommonSearchResultDocumentListModule { }
