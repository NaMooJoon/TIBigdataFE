import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { CommunityServiceService } from 'src/app/modules/communications/fe-backend-db/community/community-service.service';
import { EPAuthService } from '../../../../communications/fe-backend-db/membership/auth.service';


@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.less']
})

  export class AnnouncementComponent implements OnInit {
  
    private docList : {}[] = [];
    private pages : number[] = [];
    private cur_start_idx : number = 0;
    private isLogStat: number = 0;
    private numPagePerBloc : number = 0;
    private numPage : number = 0;
    private numBloc : number = 0;
    private blocIdx : number = 0;
    private pageIdx : number = 0;
    headers = ["번호", "이름", "내용"];
  
    constructor(       
      private router: Router, private cm_svc : CommunityServiceService, private auth : EPAuthService) { }
  
    ngOnInit() {
      this.loadFirstDocList();
      this.loadPages();
      this.auth.getLogInObs().subscribe(stat=>{
        this.isLogStat = stat;
        console.log("comm compo stat : ", stat)
      })
    }
  
  
    /**
     * 
     * 
     */
  
    async loadPages(){
      let pageInfo = await this.cm_svc.pagingAlgo();
      console.log("community compo : load pages : pageInfo : ", pageInfo)
    //  * @return numPagePerBloc
    //  * @return numPage
    //  * @return numBloc  
    //  *
      this.numPagePerBloc = pageInfo.numPagePerBloc;
      this.numPage = pageInfo.numPage;
      this.numBloc = pageInfo.numBloc;
  
      // this.pageIdx = this.numBloc  * this.numPagePerBloc;
      if(this.numBloc > 1){
        for(let i = 0 ; i < this.numPagePerBloc; i++){
          this.pages.push(i);
        }
      }
      else{
        for(let i = 0 ; i < this.numPage; i++){
          this.pages.push(i);
        }
      }
        
      /**
       * if numBloc > 1
       *  numPagePerBloc 만큼 숫자 만들기
       * else if numBloc < 1
       *  numPages만큼 숫자 만들기
       *  
       *  
       * 현재 bloc idx * numPagePerBloc의 값. 
       * 그... array에 번호를 넣는다.
       * 그 번호는 표시된다.
       * 사용자가 그번호를 누르면 그 번호에 해당하는 숫자를 백엔드로 보낸다.
       * 백엔드는 받은 숫자 * 10을 해서 새로운 index으로 삼는다.
       * 
       */
      
    
    }
  
  
  
    /**
     * @description 가장 최근 게시판 글들 로드하는 함수
     */
    async loadFirstDocList() {
      this.docList = await this.cm_svc.loadFirstDocList();
      console.log("commu compo load first doc list : ", this.docList);
      if(this.docList.length != 10){
        console.log("ERROR : community component : load first doc list : doc num not 10");
      }
      // console.log("cur_start idx : ", this.cur_start_idx)
  
      this.cur_start_idx = this.cm_svc.getNewStartIDx();//first page doc num= 기준 문서 수
      console.log("new cur_start idx : ", this.cur_start_idx)
      // console.log("community component : load first doc list : ", this.docList);
    }
  
    /**
     * 
     * @param i : i번째 문서를 읽는다
     */
    navToReadThisDoc(i: number) {
      // console.log(i+"th doc clicked!")
      this.cm_svc.choseDoc(i);
      this.router.navigateByUrl("community/readDoc");
  
    }
  
    async choosePageNum(i : number){
      // console.log("hello number ",i);
      this.docList = await this.cm_svc.loadListByPageIdx(i);
      // console.log("pressNextList : ", this.docList)
      // console.log("cur idx : ", this.cur_start_idx)
      this.cur_start_idx = this.cm_svc.getNewStartIDx();
    }
  
  
    async loadNextDocList(){
  
      this.docList = await this.cm_svc.loadNextDocList(this.cur_start_idx);
      // console.log("pressNextList : ", this.docList)
      // console.log("cur idx : ", this.cur_start_idx)
      this.cur_start_idx = this.cm_svc.getNewStartIDx();
    }
  
    /**
     * @function pressNextList
     * @description 다음 리스트의 커뮤니티 게시판을 요청하는 함수. FE 백엔드 서버에 요청.
     */
    async pressNextList() {
      
      this.docList = await this.cm_svc.loadNextDocList(this.cur_start_idx);
      // console.log("pressNextList : ", this.docList)
      // console.log("cur idx : ", this.cur_start_idx)
      this.cur_start_idx = this.cm_svc.getNewStartIDx();
      // console.log("new cur idx : ", this.cur_start_idx)
    }
  
    /**
     * @description 이전 게시판 글 리스트를 요청하는 함수
     */
    async pressPriorList() {
      this.docList = await this.cm_svc.loadPriorDocList(this.cur_start_idx);
      // console.log("pressNextList : ", this.docList)
      // console.log("cur idx : ", this.cur_start_idx)
      this.cur_start_idx = this.cm_svc.getNewStartIDx();
    }
  
  
    async pressNextBloc(){
      this.docList = [];
      this.blocIdx++;
      this.pages = [];
      let newStartIdx = this.blocIdx * this.numPagePerBloc;
      this.docList = await this.cm_svc.loadListByPageIdx(newStartIdx);
      console.log(this.docList);
      if(this.blocIdx < this.numBloc -1 ){
        for(let i = 0; i < this.numPagePerBloc ; i++ ){
          this.pages.push(newStartIdx + i);
        }
  
      }
      else{
        let redundentNumPages = this.numPage % this.numPagePerBloc;
        for(let i = 0 ; i < redundentNumPages; i++){
          this.pages.push(newStartIdx + i);
        }
      }
  
    }
  
    async pressPriorBloc(){
      this.docList = [];
  
      this.blocIdx--;
      this.pages = [];
      let newStartIdx = this.blocIdx * this.numPagePerBloc;
      this.docList = await this.cm_svc.loadListByPageIdx(newStartIdx);
      if(this.blocIdx < this.numBloc -1 ){//bloc 시작 Index = 0. numBloc = 2라면 1페이지까지가 꽉 찬다.
        for(let i = 0; i < this.numPagePerBloc ; i++ ){
          this.pages.push(newStartIdx + i);
        }
  
      }
      else{
        let redundentNumPages = this.numPage % this.numPagePerBloc;
        for(let i = 0 ; i < redundentNumPages; i++){
          this.pages.push(newStartIdx + i);
        }
      }
    }
  
  
    updateSearchKey($event){
      let keyword = $event.target.value;
    }
  
    /**
     * @description 새 글 쓰는 화면으로 이동
     */
    navToWriteNewDoc() {
      this.router.navigateByUrl("community/newDoc");
  
    }
  
  
    /**
     * 
     * 게시판 글을 불러오는 기능
     *  클릭하면 해당 글 읽기 화면으로 이동하는 함수
     *  navToReadThisDoc
     * 다음, 다음, 다음...
     *  pressNextList()
     * html.getNextList("url of the next page fuction")
     *  다음 페이지 불러오는 함수
     *  이전 페이지 불러오는 함수
     *    *  pressPriorList()
     * 새 글을 작성하는 기능 : 유저가 로그인한 상태여야 글쓰기 버튼 활성화
     *  navToWriteNewDocㅡ
     * 새 글 페이지로 이동
     *  라우터 함수
   
     * 
     * 
     * 
     */
  
  }
  