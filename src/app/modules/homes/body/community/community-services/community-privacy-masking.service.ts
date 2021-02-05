import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunityPrivacyMaskingService {

  constructor() { }

  checkNull(str: string): boolean {
    if (typeof str === 'undefined' || str == null || str == "") {
      return true;
    }
    else {
      return false;
    }
  }

  checkEmail(str: string): string {
    let originStr = str;
    let emailStr = originStr.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    console.log(emailStr);
    let strLength;

    if (this.checkNull(originStr) === true || emailStr === null || this.checkNull(emailStr.toString()) === true) {
      return originStr;
    }
    else {
      strLength = emailStr.toString().split('@')[0].length - 3;
      return originStr.toString().replace(new RegExp('.(?=.{0,' + strLength + '}@)', 'g'), '*').replace(/.{6}$/, "******");
    }
  }

  checkPhoneNum(str: string): string {
    let originStr = str;
    let phoneStr;
    let maskingStr;

    if (this.checkNull(originStr) == true) {
      return originStr;
    }

    if (originStr.toString().split('-').length != 3) { // 1) -가 없는 경우 
      phoneStr = originStr.length == 11 ? originStr.match(/\d{10}/gi) : originStr.match(/\d{11}/gi);
      if (this.checkNull(phoneStr) == true) {
        return originStr;
      }

      if (originStr.length < 11) {
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{3})(\d{4})/gi, '$1***$3'));
      }
      else { // 1.2) 01000000000 
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/(\d{3})(\d{4})(\d{4})/gi, '$1****$3'));
      }
    } else { // 2) -가 있는 경우 
      phoneStr = originStr.match(/\d{2,3}-\d{3,4}-\d{4}/gi);
      if (this.checkNull(phoneStr) == true) {
        return originStr;
      }
      if (/-[0-9]{3}-/.test(phoneStr)) { // 2.1) 00-000-0000 
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{3}-/g, "-***-"));
      } else if (/-[0-9]{4}-/.test(phoneStr)) { // 2.2) 00-0000-0000 
        maskingStr = originStr.toString().replace(phoneStr, phoneStr.toString().replace(/-[0-9]{4}-/g, "-****-"));
      }
    } return maskingStr;
  }

  checkSocialNumber(str: string): string {
    let originStr = str;
    let rrnStr;
    let maskingStr;
    let strLength;
    if (this.checkNull(originStr) == true) {
      return originStr;
    }

    rrnStr = originStr.match(/(?:[0-9]{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[1,2][0-9]|3[0,1]))-[1-4]{1}[0-9]{6}\b/gi);

    if (this.checkNull(rrnStr) == false) {
      strLength = rrnStr.toString().split('-').length;
      maskingStr = originStr.toString().replace(rrnStr, rrnStr.toString().replace(/(-?)([1-4]{1})([0-9]{6})\b/gi, "$1$2******"));
    }
    else {
      rrnStr = originStr.match(/\d{13}/gi);
      if (this.checkNull(rrnStr) == false) {
        strLength = rrnStr.toString().split('-').length;
        maskingStr = originStr.toString().replace(rrnStr, rrnStr.toString().replace(/([0-9]{6})$/gi, "******"));
      } else {
        return originStr;
      }
    } return maskingStr;
  }

  checkName(str: string): string {
    let originStr = str;
    let maskingStr;
    let strLength;

    if (this.checkNull(originStr) == true) {
      return originStr;
    }

    strLength = originStr.length;

    if (strLength < 3) {
      maskingStr = originStr.replace(/(?<=.{1})./gi, "*");
    } else {
      maskingStr = originStr.replace(/(?<=.{2})./gi, "*");
    }

    return maskingStr;
  }

  checkAllPrivacyLeak(str: string): string {
    // str = this.checkName(str);
    str = this.checkEmail(str);
    str = this.checkPhoneNum(str);
    str = this.checkSocialNumber(str);

    return str;
  }
}
