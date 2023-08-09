import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
declare const window: any;
interface grecaptcha {
  getResponse(): string;
  reset(): void;
  render(container: string, parameters: any): void;
  render(container: string, parameters: any, action: any): void;
  ready(callback: () => void): void;
  execute(siteKey: string, param: { action: string }): any;
}
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
@Injectable({
  providedIn: 'root',
})
export class RecaptchaService {
  isLoaded = false;
  hasError = false;
  constructor() {}

  load(): void {
    const script = document.createElement('script');
    script.src =
      'https://www.google.com/recaptcha/enterprise.js?render=' +
      environment.recaptchaKey;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
    script.onload = () => {
      this.isLoaded = true;
      console.log('ReCaptcha script loaded!');
    };
    script.onerror = () => {
      this.hasError = true;
      console.error('ReCaptcha script failed to load');
    };
  }

  async getToken(action: string): Promise<string> {
    return await this.execute(action);
  }

  async showBadge(): Promise<void> {
    // wait
    while (!this.isLoaded && !this.hasError) {
      console.log("waiting for recaptcha to load...")
      await sleep(300);
    }
    const divs = document.body.getElementsByTagName('div');
    let recaptcha = null;

    while (recaptcha == null && !this.hasError) {
      await sleep(300);
      for (let i = 0; i < divs.length; i++) {
        const length = divs
          ?.item(i)
          ?.getElementsByClassName('grecaptcha-badge')?.length;
        if (length != 0) {
          recaptcha = <HTMLElement>divs.item(i)?.children[0];
          break;
        }
      }
      await sleep(300);
    }
    if (recaptcha && !this.hasError) {
      recaptcha.style.visibility = 'visible';
    }
  }

  async hideBadge(): Promise<void> {
    // wait
    while (!this.isLoaded) {
      await sleep(300);
    }
    const divs = document.body.getElementsByTagName('div');
    let recaptcha = null;

    while (recaptcha == null) {
      await sleep(300);
      for (let i = 0; i < divs.length; i++) {
        const length = divs
          ?.item(i)
          ?.getElementsByClassName('grecaptcha-badge')?.length;
        if (length != 0) {
          recaptcha = <HTMLElement>divs.item(i)?.children[0];
          break;
        }
      }
      await sleep(300);
    }
    if (recaptcha) {
      recaptcha.style.visibility = 'hidden';
    }
  }

  ready(callback: () => void): void {
    window.grecaptcha.enterprise.ready(callback);
  }

  execute(action: string): any {
    return window.grecaptcha.enterprise.execute(environment.recaptchaKey, {
      action: action,
    });
  }
}
