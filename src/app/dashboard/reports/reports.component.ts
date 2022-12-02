import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  locations: Map<string, string> = new Map();
  locationsFilter: string[] = [];
  constructor() {
    this.locations.set('Pablo Borbon', 'pablo-borbon');
    this.locations.set('Alangilan', 'alangilan');
    this.locations.set('ARASOF-Nasugbu', 'nasugbu');
    this.locations.set('Balayan', 'balayan');
    this.locations.set('Lemery', 'lemery');
    this.locations.set('Mabini', 'mabini');
    this.locations.set('JPLPC-Malvar', 'malvar');
    this.locations.set('Lipa', 'lipa');
    this.locations.set('Rosario', 'rosario');
    this.locations.set('San Juan', 'san-juan');
    this.locations.set('Lobo', 'lobo');
    this.locationsFilter = Array.from(this.locations.keys());
  }

  ngOnInit(): void {}

  onFilterChange(event: string[]): void {
    console.log(event);
  }
}
