import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryAnalysisHelperService {

  constructor() { }

  getTopicFromButtonClick(event) {
    var topic = event.target.id;
    return topic ;
  }
}
