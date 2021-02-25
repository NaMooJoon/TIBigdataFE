import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SearchBarService {
  private _searchKeyword: string;
  private _relatedKeywordList: Array<string>;

  constructor() {}

  public get relatedKeywordList(): Array<string> {
    return this._relatedKeywordList;
  }
  public set relatedKeywordList(value: Array<string>) {
    this._relatedKeywordList = value;
  }
  public get searchKeyword(): string {
    return this._searchKeyword;
  }
  public set searchKeyword(value: string) {
    this._searchKeyword = value;
  }
}
