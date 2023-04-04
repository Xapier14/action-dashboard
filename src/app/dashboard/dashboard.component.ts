import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
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
      name: 'Home',
      icon: 'assets/svg/home.svg',
      id: 'overview',
    },
    {
      name: 'Reports',
      icon: 'assets/svg/file.svg',
      id: 'reports',
    },
    {
      name: 'Accounts',
      icon: 'assets/svg/users.svg',
      id: 'accounts',
    },
    {
      name: 'Attachments',
      icon: 'assets/svg/attach.svg',
      id: 'attachments',
    },
    {
      name: 'Logs',
      icon: 'assets/svg/logs.svg',
      id: 'logs',
    }
  ];

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {}

  onMenuClick() {
    this.sidemenuVisible = !this.sidemenuVisible;
  }

  onSideMenuItemClick(item: string) {
    console.log('item clicked', item);
    this.router.navigate([`/dashboard/${item}`]);
    this.sidemenuVisible = false;
  }

  onSettingsClick() {
    console.log('settings clicked');
    this.sidemenuVisible = false;
  }

  async onLogoutClick() {
    await this.authService.logout();
    this.router.navigate([`/`]);
  }
}
