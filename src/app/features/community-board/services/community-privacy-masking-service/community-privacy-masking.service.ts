import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunityPrivacyMaskingService {

  constructor() { }
  maskingSocialNumber(originalText): string {
    let regex: RegExp = /(\d{6})([\s|-]?)(\d{7})/gi;
    if (regex.test(originalText)) {
      let maskedText = originalText.replace(regex, '$1$2*******');
      return maskedText;
    }
    else {
      return originalText
    }
  }

  maskingDriverLicense(originalText: string): string {
    let regex: RegExp = /(\d{2}|\D{2})([\s|-]?)(\d{2})([\s|-]?)(\d{6})([\s|-]?)(\d{2})/gi;
    if (regex.test(originalText)) {
      let maskedText = originalText.replace(regex, '$1$2$3$4******$6$7');
      return maskedText;
    }
    else {
      return originalText;
    }
  }

  maskingPassport(originalText: string): string {
    let regex: RegExp = /(\D{1})(\d{8})/gi;
    if (regex.test(originalText)) {
      let maskedText = originalText.replace(regex, '$1********');
      return maskedText;
    }
    else {
      return originalText;
    }
  }

  maskingBankingAccount(originalText: string): string {
    let regex: RegExp = /(\d{3})([\s|-]?)(\d{6})([\s|-]?)(\d{2})([\s|-]?)(\d{3})/gi;
    if (regex.test(originalText)) {
      let maskedText = originalText.replace(regex, '$1$2******$4$5$6$7');
      return maskedText;
    }
    else {
      return originalText;
    }
  }

  maskingCardNumber(originalText: string): string {
    let regex: RegExp = /(\d{4})([\s|-]?)(\d{4})([\s|-]?)(\d{4})([\s|-]?)(\d{4})/gi;
    if (regex.test(originalText)) {
      let maskedText = originalText.replace(regex, '$1$2****$4****$6$7');
      return maskedText;
    }
    else {
      return originalText;
    }
  }


  maskingMobileNumber(originalText: string): string {
    if (originalText) {
      let regex: RegExp = /(\d{3})([\s|-]?)(\d{2})(\d{2})([\s|-]?)(\d{2})(\d{2})/gi;
      let maskedText = originalText.replace(regex, '$1$2$3**$5$6**');
      return maskedText;
    }
  }


  maskingTelNumber(originalText: string): string {
    let maskedText = '';
    let regex: RegExp = /(\d{2,4})([\s|-]?)(\d{1,2})(\d{2})([\s|-]?)(\d{2})(\d{2})/gi; // 3자리 패턴
    if (regex.test(originalText)) {
      maskedText = originalText.replace(regex, '$1$2$3**$5$6**');
    }
    else {
      regex = /(\d{1,2})(\d{2})([\s|-]?)(\d{2})(\d{2})/gi; // 2자리 패턴
      if (regex.test(originalText)) {
        maskedText = originalText.replace(regex, '$1**$3$4**');
      }
      else {
        return originalText;
      }
    }
    return maskedText;
  }

  maskingEmail(originalText: string): string {
    if (originalText && originalText.indexOf('@') > -1) {
      let maskedText = '';
      const len = originalText.split('@')[0].length - 3;
      maskedText = originalText.replace(new RegExp('.(?=.{0,' + len + '}@)', 'g'), '*');
      return maskedText;
    }
    else {
      return originalText;
    }
  }

  checkAllPrivacyLeak(str: string): string {
    str = this.maskingBankingAccount(str);
    str = this.maskingCardNumber(str);
    str = this.maskingDriverLicense(str);
    str = this.maskingEmail(str);
    str = this.maskingMobileNumber(str);
    str = this.maskingPassport(str);
    str = this.maskingSocialNumber(str);
    str = this.maskingTelNumber(str);
    return str;
  }
}
