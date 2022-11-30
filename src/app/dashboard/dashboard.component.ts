import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardSideMenuComponent } from './dashboard-side-menu/dashboard-side-menu.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('sidemenu') sidemenu: any;
  sidemenuVisible: boolean = false;
  sidemenuItems = [
    {
      name: 'Overview',
      icon: 'dashboard',
      id: 'overview',
    },
    {
      name: 'Reports',
      icon: 'reports',
      id: 'reports',
    },
    {
      name: 'Accounts',
      icon: 'accounts',
      id: 'accounts',
    },
    {
      name: 'Attachments',
      icon: 'attachments',
      id: 'attachments',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  onMenuClick() {
    this.sidemenuVisible = !this.sidemenuVisible;
  }

  onSideMenuItemClick(item: string) {
    console.log('item clicked', item);
    this.sidemenuVisible = !this.sidemenuVisible;
  }

  onSettingsClick() {
    console.log('settings clicked');
    this.sidemenuVisible = !this.sidemenuVisible;
  }
}
