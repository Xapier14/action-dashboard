import { Component, EventEmitter, Output } from '@angular/core';
import { SearchService } from 'src/app/services/search.service';
interface UserResult {
  id: string;
  fullName: string;
  location: string;
  email: string;
}
interface BuildingResult {
  id: string;
  name: string;
  location: string;
  address: string;
  buildingMarshal: string;
}
interface SearchResult {
  users: UserResult[];
  buildings: BuildingResult[];
}
@Component({
  selector: 'search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss'],
})
export class SearchResultsComponent {
  results: SearchResult = {
    users: [],
    buildings: [],
  };
  searching: boolean = true;
  @Output() close = new EventEmitter();
  @Output() clickBuilding = new EventEmitter<string>();
  @Output() clickUser = new EventEmitter<string>();

  constructor(private searchService: SearchService) {
    this.searchService.searchResultReady.subscribe((results) => {
      this.results = results;
    });
    this.searchService.searchStateUpdate.subscribe((searching) => {
      this.searching = searching;
    });
  }

  clickOutside(eventArgs: any) {
    if (eventArgs.target !== eventArgs.currentTarget) return;
    this.close.emit();
  }

  userClick(id: string) {
    this.clickUser.emit(id);
    this.close.emit();
  }

  buildingClick(id: string) {
    this.clickBuilding.emit(id);
    this.close.emit();
  }

  translateLocationCode(code: string) {
    switch (code) {
      case 'pablo-borbon':
        return 'Pablo Borbon';
      case 'alangilan':
        return 'Alangilan';
      case 'nasugbu':
        return 'ARASOF-Nasugbu';
      case 'balayan':
        return 'Balayan';
      case 'lemery':
        return 'Lemery';
      case 'mabini':
        return 'Mabini';
      case 'malvar':
        return 'JPLPC-Malvar';
      case 'lipa':
        return 'Lipa';
      case 'rosario':
        return 'Rosario';
      case 'san-juan':
        return 'San Juan';
      case 'lobo':
        return 'Lobo';
      default:
        return code;
    }
  }
}
