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
    this.idList = [];
    this.oneID = "";
  }

  pushIDList(id: string) {
    this.idList.push(id);
  }

  popIDList() {
    this.idList.pop();
  }

  clearIDList() {
    this.idList = [];
  }

  getIDList() {
    return this.idList;
  }

  clearIds() {
    this.idList = [];
  }

  selecOneID(id: string) {
    this.oneID = id;
    // console.log(this.idChosen);
  }

  getOneID() {
    return this.oneID;
  }

  clearOneID() {
    this.oneID = "";
  }

  getArticle() {
    return this.article;
  }

  setArticle(art: ArticleSource) {
    this.article = art;
  }

 

  

  



}
