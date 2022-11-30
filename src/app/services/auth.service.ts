import { Injectable } from '@angular/core';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpService: HttpService) {}

  async tryLogin(email: string, password: string, accessLevel: number = 1) {
    try {
      const response = await (
        await this.httpService.postEncodedObjectAsync('login', {
          email: email,
          password: password,
          accessLevel: accessLevel,
        })
      ).json();
      if (response.e == 0) {
        const token = response.token;
        localStorage.setItem('token', JSON.stringify(token));
      }
      return response;
    } catch (error) {
      return { e: 400, msg: 'Network error' };
    }
  }

  async checkToken(token: string, clearIfInvalid: boolean = false) {
    try {
      const response = await (
        await this.httpService.getAsync('check', undefined, token)
      ).json();

      if (clearIfInvalid && response?.sessionState != 'validSession')
        localStorage.removeItem('token');

      return response;
    } catch (error) {
      if (clearIfInvalid) localStorage.removeItem('token');
      return { sessionState: 'invalidSession' };
    }
  }

  async getTokenAsync() {
    const json = localStorage.getItem('token');
    const token = json ? JSON.parse(json) : null;
    return token.value;
  }

  async hasStoredToken() {
    const json = localStorage.getItem('token');
    const token = json ? JSON.parse(json) : null;
    return token.value != null;
  }

  async checkTokenFromPreferences(clearIfInvalid: boolean = false) {
    const json = localStorage.getItem('token');
    const token = json ? JSON.parse(json) : null;
    return await this.checkToken(token.value, clearIfInvalid);
  }

  async logout() {
    // add logout logic here
    // const token = await Preferences.get({ key: 'token' });
    const json = localStorage.getItem('token');
    const token = json ? JSON.parse(json) : null;
    await this.httpService.postJsonAsync('logout', null, token.value);
    localStorage.removeItem('token');
  }
}
