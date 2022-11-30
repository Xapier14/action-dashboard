import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'dashboard-navbar',
  templateUrl: './dashboard-nav-bar.component.html',
  styleUrls: ['./dashboard-nav-bar.component.scss'],
})
export class DashboardNavBarComponent implements OnInit {
  @Output() menuClick = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}
}
