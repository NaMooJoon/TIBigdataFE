import { Component, Input, Output, OnInit , EventEmitter} from '@angular/core';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.less']
})
export class SearchFilterComponent implements OnInit {

  public topics =["전체", "정치", "경제", "사회", "문화", "국제", "지역", "스포츠"];


  public sValue;


  constructor() { }

  ngOnInit() {
  }

  @Output() dateChange= new EventEmitter();
  @Input()
  get date() {
    return this.sValue;
  }

  set date(val){
    this.sValue=val;
    this.dateChange.emit(this.sValue);
  }

}
