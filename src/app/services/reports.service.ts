import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private currentPage: number = 0;
  private limit: number = 20;
  private cachedMax: number | undefined;
  private cachedTotal: number | undefined;
  private isEndOfList: boolean = false;
  private autoIncrement: boolean = false;
  private filter = {};

  constructor(
    private authService: AuthService,
    private httpService: HttpService
  ) {}

  hasMoreData(): boolean {
    return !this.isEndOfList;
  }

  getAutoIncrement(): boolean {
    return this.autoIncrement;
  }
  setAutoIncrement(autoIncrement: boolean) {
    this.autoIncrement = autoIncrement;
  }

  getCurrentPage(): number {
    return this.currentPage;
  }
  setCurrentPage(page: number) {
    this.currentPage = Math.max(0, page);
    if (this.cachedMax && this.currentPage > this.cachedMax) {
      this.currentPage = this.cachedMax;
    }
    if (this.currentPage == this.cachedMax) {
      this.isEndOfList = true;
    }
  }

  setLimit(limit: number) {
    if (limit < 1) return;
    this.limit = limit;
  }

  getLimit(): number {
    return this.limit;
  }

  incrementPage() {
    this.setCurrentPage(this.currentPage + 1);
  }
  decrementPage() {
    this.setCurrentPage(this.currentPage - 1);
  }

  getCachedMax(): number {
    return this.cachedMax ?? 0;
  }

  getCachedTotal(): number {
    return this.cachedTotal ?? 0;
  }

  setFilter(key: string, value: any) {
    this.filter[key] = value;
  }

  getFilter(key: string): any {
    return this.filter[key];
  }

  hasFilter(key: string): boolean {
    return this.filter[key] !== undefined;
  }

  removeFilter(key: string) {
    delete this.filter[key];
  }

  clearFilter() {
    this.filter = {};
  }

  async getListDataAsync() {
    if (this.isEndOfList && this.autoIncrement) return [];

    const token = await this.authService.checkTokenFromPreferences();
    if (!token || token.sessionState != 'validSession') return [];
    // add filter to params
    let params = new URLSearchParams({
      pageOffset: this.currentPage.toString(),
      limit: this.limit.toString(),
    });
    for (let key in this.filter) {
      if (typeof this.filter[key] == 'string') {
        params.append(key, this.filter[key]);
      } else {
        params.append(key, JSON.stringify(this.filter[key]));
      }
    }
    const response = await (
      await this.httpService.getAsync('incidents/', params, token.token)
    ).json();
    if (response.e == 0) {
      if (this.autoIncrement) this.currentPage++;
      this.cachedMax = response.maxPageOffset;
      this.cachedTotal = response.totalReportCount;
      if (this.currentPage > response.maxPageOffset) this.isEndOfList = true;
      return response.reports;
    }
    return [];
  }

  refreshList() {
    this.currentPage = 0;
    this.isEndOfList = false;
  }

  async getReportAsync(id: string) {
    const token = await this.authService.checkTokenFromPreferences();
    if (!token || token.sessionState != 'validSession') return undefined;
    const response = await (
      await this.httpService.getAsync(`incidents/${id}`, undefined, token.token)
    ).json();
    if (response.e != 0) return undefined;
    return response.incident;
  }

  async countReportsAsync(
    location: string,
    buildingId?: string
  ): Promise<number> {
    try {
      const token = await this.authService.getTokenAsync();
      let params = new URLSearchParams({
        location: location,
      });
      if (buildingId) params.append('building', buildingId);
      const response = await (
        await this.httpService.getAsync('misc/reports', params, token ?? '')
      ).json();
      if (response.e != 0) return 0;
      return response.count;
    } catch (error) {
      return 0;
    }
  }
}
