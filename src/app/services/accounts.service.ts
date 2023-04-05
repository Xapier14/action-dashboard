import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

export interface AccountData {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
}
@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  cachedAccounts: Map<string, AccountData> = new Map();
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
      return response.count ?? 0;
    } catch (error) {
      return 0;
    }
  }

  async getAccountDataAsync(id: string): Promise<AccountData | null> {
    if (this.cachedAccounts.has(id))
      return this.cachedAccounts.get(id) ?? null;
    try {
      const token = await this.authService.getTokenAsync() ?? '';
      const params = new URLSearchParams({
        id : id
      });
      const response = await (
        await this.httpService.getAsync(
          `misc/resolve`,
          params,
          token
        )
      ).json();
      const accountData: AccountData = {
        id: response.userId,
        firstName: response.user.firstName,
        lastName: response.user.lastName,
        location: response.user.location,
      };
      this.cachedAccounts.set(id, accountData);
      return accountData;
    } catch (error) {
      return null;
    }
  }
}
