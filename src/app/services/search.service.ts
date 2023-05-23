import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  userSearchResults: any[] = [];
  buildingSearchResults: any[] = [];
  searchResultReady = new Subject<any>();
  searchStateUpdate = new Subject<boolean>();
  abortController = new AbortController();
  searching = false;
  aborting = false;
  latestQuery = '';

  constructor(
    private authService: AuthService,
    private httpService: HttpService
  ) {}

  cancelSearch() {
    this.abortController.abort();
    this.abortController = new AbortController();
    this.aborting = false;
    this.searching = false;
    this.searchStateUpdate.next(false);
    this.userSearchResults = [];
    this.buildingSearchResults = [];
    this.searchResultReady.next({
      users: [],
      buildings: [],
    });
  }

  async searchAsync(query: string) {
    const token = await this.authService.getTokenAsync();
    if (!token) return;
    this.latestQuery = query;
    if (this.aborting) return;
    if (this.searching) {
      this.aborting = true;
      this.abortController.abort();
      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.abortController = new AbortController();
      this.aborting = false;
    }
    this.userSearchResults = [];
    this.buildingSearchResults = [];
    this.searching = true;
    this.searchStateUpdate.next(true);
    if (this.latestQuery === '') {
      this.searching = false;
      this.searchStateUpdate.next(false);
      this.searchResultReady.next({
        users: [],
        buildings: [],
      });
      return;
    }
    try {
      const response = await this.httpService.getAsyncParams(
        'misc/search',
        {
          query: this.latestQuery,
        },
        token,
        this.abortController
      );
      this.searching = false;
      this.searchStateUpdate.next(false);
      if (response.status === 200) {
        const json = await response.json();
        this.userSearchResults = json.users;
        this.buildingSearchResults = json.buildings;
        this.searchResultReady.next({
          users: this.userSearchResults,
          buildings: this.buildingSearchResults,
        });
      } else {
        this.searchResultReady.next({
          users: [],
          buildings: [],
        });
      }
    } catch (e: any) {
      // if abort
      if (e.name === 'AbortError') return;
      this.searching = false;
      this.searchStateUpdate.next(false);
      this.searchResultReady.next({
        users: [],
        buildings: [],
      });
    }
  }
}
