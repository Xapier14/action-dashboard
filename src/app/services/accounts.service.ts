import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

export interface AccountData {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
}
export interface FullAccountInfo extends AccountData {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  maxAccessLevel: number;
  createdAt: Date;
  isLocked: boolean;
  lastLocked: Date | undefined;
}

@Injectable({
  providedIn: 'root',
})
export class AccountsService {
  cachedAccounts: Map<string, FullAccountInfo> = new Map();
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
          'accounts/count',
          params,
          (await this.authService.getTokenAsync()) ?? ''
        )
      ).json();
      return response.count ?? 0;
    } catch (error) {
      return 0;
    }
  }

  async getAccountDataAsync(id: string): Promise<FullAccountInfo | null> {
    if (this.cachedAccounts.has(id)) return this.cachedAccounts.get(id) ?? null;
    try {
      const token = (await this.authService.getTokenAsync()) ?? '';
      const response = await (
        await this.httpService.getAsync(`accounts/${id}`, undefined, token)
      ).json();
      const accountData: FullAccountInfo = {
        id: response.account.userId,
        firstName: response.account.firstName,
        lastName: response.account.lastName,
        location: response.account.location,
        email: response.account.email,
        maxAccessLevel: response.account.maxAccessLevel,
        createdAt: new Date(response.account.createdAt),
        isLocked: response.account.isLocked,
        lastLocked: response.account.lastLocked,
      };
      this.cachedAccounts.set(id, accountData);
      return accountData;
    } catch (error) {
      return null;
    }
  }

  async getAccountsFromLocation(location = 'all'): Promise<FullAccountInfo[]> {
    try {
      const token = (await this.authService.getTokenAsync()) ?? '';
      const params = new URLSearchParams({
        location: location,
      });
      const response = await (
        await this.httpService.getAsync(`accounts/list`, params, token)
      ).json();
      const accounts: FullAccountInfo[] = [];
      response.accounts.forEach((account: any) => {
        accounts.push({
          id: account.id,
          firstName: account.firstName,
          lastName: account.lastName,
          location: account.location,
          email: account.email,
          maxAccessLevel: account.maxAccessLevel,
          createdAt: new Date(account.createdAt),
          isLocked: account.isLocked,
          lastLocked: account.lastLocked
            ? new Date(account.lastLocked)
            : undefined,
        });
      });
      return accounts;
    } catch (error) {
      return [];
    }
  }

  async unlockLoginRestrictionAsync(id: string): Promise<Boolean> {
    try {
      const token = (await this.authService.getTokenAsync()) ?? '';
      const response = await this.httpService.postJsonAsync(
        `accounts/unlock/${id}`,
        null,
        token
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  async lockLoginRestrictionAsync(id: string): Promise<Boolean> {
    try {
      const token = (await this.authService.getTokenAsync()) ?? '';
      const response = await this.httpService.postJsonAsync(
        `accounts/lock/${id}`,
        null,
        token
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  async deleteAccountAsync(id: string): Promise<void> {
    try {
      const token = (await this.authService.getTokenAsync()) ?? '';
      await this.httpService.deleteAsync(`accounts/delete/${id}`, token);
    } catch (error) {}
  }

  async changePasswordAsync(id: string, newPassword: string): Promise<Boolean> {
    try {
      const token = (await this.authService.getTokenAsync()) ?? '';
      const response = await this.httpService.postJsonAsync(
        `accounts/change-password/${id}`,
        new URLSearchParams({ password: newPassword }),
        token
      );
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  async editAccountAsync(id: string, data: any): Promise<void> {
    try {
      const token = (await this.authService.getTokenAsync()) ?? '';
      await this.httpService.postJsonAsync(`accounts/edit/${id}`, data, token);
    } catch (error) {}
  }
}
