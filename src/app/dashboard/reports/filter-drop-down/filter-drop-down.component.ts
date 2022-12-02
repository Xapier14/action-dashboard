import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'filter-dropdown',
  templateUrl: './filter-drop-down.component.html',
  styleUrls: ['./filter-drop-down.component.scss'],
})
export class FilterDropDownComponent implements OnInit {
  @Input('filter') filter: string[] = [];
  @Input('label') label: string = 'Filter';
  @Input('filterImg') filterImg: string = '';
  @Input('canSelectAll') canSelectAll: boolean = false;
  @Output() filterChange = new EventEmitter<string[]>();

  selected: string[] = [];
  visible: boolean = false;

  constructor() {}

  isSelected(item: string) {
    return this.selected.includes(item);
  }

  toggleSelection(item: string) {
    if (this.selected.includes(item)) {
      this.selected = this.selected.filter((i) => i !== item);
    } else {
      this.selected.push(item);
    }
    this.filterChange.emit(this.selected);
  }

  toggleDropdown() {
    this.visible = !this.visible;
    if (!this.visible) {
      this.selected = [];
    }
  }

  ngOnInit(): void {}
}
