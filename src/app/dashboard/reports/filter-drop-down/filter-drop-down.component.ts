import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'filter-dropdown',
  templateUrl: './filter-drop-down.component.html',
  styleUrls: ['./filter-drop-down.component.scss'],
})
export class FilterDropDownComponent implements OnInit {
  @Input('filter') filter: string[] = [];
  @Input('values') values: any[] = [];
  @Input('label') label: string = 'Filter';
  @Input('filterImg') filterImg: string = '';
  @Input('canSelectAll') canSelectAll: boolean = false;
  @Input('disabled') disabled: boolean = false;
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
    let values: any[] = [];
    this.selected.forEach((value) => {
      const i = this.filter.indexOf(value);
      if (i >= this.values.length) {
        values.push(value);
      }
      values.push(this.values[i]);
    });
    this.filterChange.emit(values);
  }

  toggleDropdown() {
    this.visible = !this.visible;
    if (!this.visible) {
      this.selected = [];
      this.filterChange.emit([]);
    }
  }

  ngOnInit(): void {}
}