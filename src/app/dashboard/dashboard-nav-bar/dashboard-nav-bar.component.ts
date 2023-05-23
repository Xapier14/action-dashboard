import { query } from '@angular/animations';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dashboard-navbar',
  templateUrl: './dashboard-nav-bar.component.html',
  styleUrls: ['./dashboard-nav-bar.component.scss'],
})
export class DashboardNavBarComponent implements OnInit {
  searchQuery: string = '';
  oldSearchQuery: string = '';

  @Output() menuClick = new EventEmitter();
  @Output() searchEmit = new EventEmitter(true);

  constructor() {}

  ngOnInit(): void {}

  emitSearch(key?: string, override?: boolean) {
    const searchQuery = this.searchQuery + (key ?? '');
    if (searchQuery == this.oldSearchQuery) return;
    if (searchQuery.length > 2 || override) {
      if (searchQuery.length != 0) this.searchEmit.emit(searchQuery);
      this.oldSearchQuery = searchQuery;
    }
  }

  clear() {
    this.searchQuery = '';
    this.oldSearchQuery = '';
    this.emitSearch();
  }

  onSearchChange(keyEvent: any) {
    const isEnter = keyEvent.key == 'Enter';
    const isLetter = keyEvent.key.length == 1;
    this.emitSearch(isLetter ? keyEvent.key : undefined, isEnter);
  }
}
