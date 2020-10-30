import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WordcloudComponent } from './wordcloud/wordcloud.component';
import { WordcloudService } from './wordcloud/wordcloud.service'


@NgModule({
  declarations: [
    WordcloudComponent
  ],
  imports: [
    CommonModule
  ],
  providers : [
    WordcloudService
  ]
})
export class GraphsModule { }
