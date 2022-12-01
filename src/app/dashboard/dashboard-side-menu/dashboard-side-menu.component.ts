import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dashboard-sidemenu',
  templateUrl: './dashboard-side-menu.component.html',
  styleUrls: ['./dashboard-side-menu.component.scss'],
})
export class DashboardSideMenuComponent implements OnInit {
  @Input() items: {
    name: string;
    icon: string;
    id: string;
  }[] = [];
  @Output() itemClick = new EventEmitter();
  @Output() settingsClick = new EventEmitter();
  @Output() logoutClick = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}
}
