import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  constructor() {}

  async postJsonAsync(route: string, data: object | null, token?: string) {
    const endpoint = environment.apiHost + '/' + route;
    const headers: HeadersInit = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) headers.append('Authorization', token);
    if (data) {
      return await fetch(endpoint, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(data),
      });
    } else {
      return await fetch(endpoint, {
        method: 'POST',
        headers: headers,
      });
    }
  }

  async postEncodedObjectAsync(route: string, data: object, token?: string) {
    let urlSearchParams = new URLSearchParams();
    Object.keys(data).forEach((key) => {
      urlSearchParams.append(key, data[key]);
    });
    return await this.postEncodedAsync(route, urlSearchParams, token);
  }

  async postEncodedAsync(route: string, data: URLSearchParams, token?: string) {
    const endpoint = environment.apiHost + '/' + route;
    const headers: HeadersInit = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded');
    if (token) headers.append('Authorization', token);
    return await fetch(endpoint, {
      method: 'POST',
      headers: headers,
      body: data,
    });
  }

  async getAsync(route: string, data?: URLSearchParams, token?: string) {
    const endpoint =
      environment.apiHost + '/' + route + (data ? `?${data}` : '');
    const headers: HeadersInit = new Headers();
    if (token) headers.append('Authorization', token);
    return await fetch(endpoint, {
      method: 'GET',
      headers: headers,
    });
  }

  async getAsyncParams(route: string, query?: object, token?: string) {
    const endpoint =
      environment.apiHost +
      '/' +
      route +
      (query ? `?${this.queryString(query)}` : '');
    const headers: HeadersInit = new Headers();
    if (token) headers.append('Authorization', token);
    return await fetch(endpoint, {
      method: 'GET',
      headers: headers,
    });
  }

  private queryString(query: object) {
    if (!query) return '';
    return Object.keys(query)
      .map((key) => key + '=' + query[key])
      .join('&');
  }
}
