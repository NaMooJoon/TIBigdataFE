import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListDocumentsComponent } from './list-documents/list-documents.component';
import { ArticleDetailsComponent } from './article/article-details/article-details.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    ListDocumentsComponent,
    ArticleDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [
    ListDocumentsComponent
  ]
})
export class CommonSearchResultDocumentListModule { }
