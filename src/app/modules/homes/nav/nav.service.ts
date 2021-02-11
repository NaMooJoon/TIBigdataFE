import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum navMenu { LIBRARY, ANALYSIS, COMMUNITY, ABOUT, MYPAGE, LOGIN, REGISTER, NONE }

@Injectable({
  providedIn: 'root'
})
export class NavService {

  private navMenuChange$: BehaviorSubject<navMenu> = new BehaviorSubject<navMenu>(navMenu.NONE);
  constructor() { }

  getNavMenuChange() {
    return this.navMenuChange$.asObservable();
  }

  setNavMenu(menu: navMenu) {
    this.navMenuChange$.next(menu);
  }
}
