import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountsService,
  FullAccountInfo,
} from 'src/app/services/accounts.service';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
})
export class ListViewComponent implements OnInit {
  displayedItems: number = 0;
  totalItems: number = 0;
  currentPage: number = 1;
  pageCount: number = 1;
  accountsData: FullAccountInfo[] | undefined = [];

  constructor(
    private accountsService: AccountsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    await this.updateDataview();
    // this.logsService.clearFilter();
    // this.logsService.setAutoIncrement(false);
  }

  navFirstPage() {
    // this.logsService.setCurrentPage(0);
    this.updateDataview();
  }
  navPrevPage() {
    // this.logsService.decrementPage();
    this.updateDataview();
  }
  navNextPage() {
    // this.logsService.incrementPage();
    this.updateDataview();
  }
  navLastPage() {
    // this.logsService.setCurrentPage(this.pageCount - 1);
    this.updateDataview();
  }
  async editAccount(id: string) {
    await this.router.navigate(['dashboard', 'accounts', 'edit', id]);
  }
  async deleteAccount(id: string) {
    if (confirm('Are you sure you want to delete this account?')) {
      await this.accountsService.deleteAccountAsync(id);
      await this.updateDataview();
    }
  }
  async lockAccount(id: string) {
    await this.accountsService.lockLoginRestrictionAsync(id);
    await this.updateDataview();
  }
  async unlockAccount(id: string) {
    await this.accountsService.unlockLoginRestrictionAsync(id);
    await this.updateDataview();
  }
  async newAccount() {
    await this.router.navigate(['dashboard', 'accounts', 'create']);
  }

  async updateDataview() {
    console.log('updateDataview');
    const accounts = await this.accountsService.getAccountsFromLocation();
    this.accountsData = accounts;
  }

  async refresh(keepCurrentPage: boolean = true) {
    await this.updateDataview();
  }
}
