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

  selectedKeys: string[] = [];
  visible: boolean = false;

  constructor() {}

  isSelected(key: string) {
    return this.selectedKeys.includes(key);
  }

  toggleSelection(item: string) {
    if (this.selectedKeys.includes(item)) {
      this.selectedKeys.splice(this.selectedKeys.indexOf(item), 1);
    } else {
      this.selectedKeys.push(item);
    }
    this.filterChange.emit(this.keysToValues(this.selectedKeys));
  }

  toggleDropdown() {
    this.visible = !this.visible;
    if (!this.visible && this.selectedKeys.length != 0) {
      this.selectedKeys = [];
      this.filterChange.emit([]);
    }
  }

  private keysToValues(keys: string[]): any[] {
    let values: any[] = [];
    keys.forEach((key) => {
      const index = this.filter.indexOf(key);
      if (index >= 0 && index < this.values.length) {
        values.push(this.values[index]);
      } else {
        values.push(key);
      }
    });
    return values;
  }

  ngOnInit(): void {}
}
