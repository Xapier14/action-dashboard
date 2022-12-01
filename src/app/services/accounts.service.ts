import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  constructor(
    private httpService: HttpService,
    private authService: AuthService
  ) {}

  async countAccountsAsync(location?: string): Promise<number> {
    try {
      let params = {};
      if (location) params = { location: location };
      const response = await (
        await this.httpService.getAsyncParams(
          'misc/accounts',
          params,
          (await this.authService.getTokenAsync()) ?? ''
        )
      ).json();
      console.log(response);
      return response.count ?? 0;
    } catch (error) {
      return 0;
    }
  }
}
