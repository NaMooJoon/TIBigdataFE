import { ArticleSource } from '../../../shared-module/common-search-result-document-list/article/article.interface';
import { Injectable } from '@angular/core';

// import { HomesModule } from '../../../homes.module'

@Injectable(  
  {
    providedIn: 'root'
  }
    )
export class IdControlService {
  private oneID: string = "";
  private idList: string[] = [];
  private article: ArticleSource;

  constructor() { }


  /**
   * @description 
   */
  clearAll() {
    this.oneID = "";
    this.idList = [];
    this.oneID = "";
  }

  setIdList(id: string) {
    this.idList.push(id);
  }

  popIdList() {
    this.idList.pop();
  }

  clearIdList() {
    this.idList = [];
  }

  getIdList() {
    return this.idList;
  }

  clearIds() {
    this.idList = [];
  }

  setIdChosen(id: string) {
    this.oneID = id;
    // console.log(this.idChosen);
  }

  getIdChosen() {
    return this.oneID;
  }

  clearIdChosen() {
    this.oneID = "";
  }

  getArticle() {
    return this.article;
  }

  setArticle(art: ArticleSource) {
    this.article = art;
  }

 

  

  



}
