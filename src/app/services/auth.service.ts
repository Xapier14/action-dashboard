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
        localStorage.setItem('token', token);
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
      return { sessionState: 'invalidSession', netError: true };
    }
  }

  async isAuthenticated() {
    const token = localStorage.getItem('token');
    const response = await this.checkToken(token ?? '');
    if (response?.netError) return Promise.reject(response);
    return response.sessionState == 'validSession';
  }

  clearToken() {
    localStorage.removeItem('token');
  }

  hasToken() {
    const token = localStorage.getItem('token');
    return token != null;
  }

  async getTokenAsync() {
    const json = localStorage.getItem('token');
    const token = json;
    return token;
  }

  async hasStoredToken() {
    const token = localStorage.getItem('token');
    return token != null;
  }

  async checkTokenFromPreferences(clearIfInvalid: boolean = false) {
    const token = localStorage.getItem('token');
    return await this.checkToken(token ?? '', clearIfInvalid);
  }

  async logout() {
    // add logout logic here
    // const token = await Preferences.get({ key: 'token' });
    const token = localStorage.getItem('token');
    await this.httpService.postJsonAsync('logout', null, token ?? '');
    localStorage.removeItem('token');
  }
}
