import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountsService,
  FullAccountInfo,
} from 'src/app/services/accounts.service';

@Component({
  selector: 'app-modify-view',
  templateUrl: './modify-view.component.html',
  styleUrls: ['./modify-view.component.scss'],
})
export class ModifyViewComponent {
  accountData: FullAccountInfo | undefined = undefined;

  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  location: string | undefined;
  maxAccessLevel: number | undefined;
  password: string | undefined;

  constructor(
    private accountsService: AccountsService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.router.url.split('/').pop();
    if (id === undefined) {
      this.goBack();
    }
    const account = await this.accountsService.getAccountDataAsync(id!);
    if (account === undefined) {
      this.goBack();
    }
    this.accountData = account!;
    console.log(this.accountData);
    await this.revertChanges();
  }

  async revertChanges() {
    this.firstName = this.accountData?.firstName;
    this.lastName = this.accountData?.lastName;
    this.email = this.accountData?.email;
    this.location = this.accountData?.location;
    this.maxAccessLevel = this.accountData?.maxAccessLevel;
    this.password = undefined;
  }

  async saveChanges() {
    if (this.accountData === undefined) {
      return;
    }
    const account = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      location: this.location,
      maxAccessLevel: this.maxAccessLevel,
    };
    await this.accountsService.editAccountAsync(this.accountData.id, account);
    alert('Account updated!');
  }

  async changePassword() {
    if (this.accountData === undefined) {
      return;
    }
    if (this.password === undefined) {
      return;
    }
    const result = await this.accountsService.changePasswordAsync(
      this.accountData.id,
      this.password
    );
    if (result) {
      alert('Password changed!');
    } else {
      alert('Password change failed!');
    }
  }

  async goBack() {
    await this.router.navigate(['dashboard', 'accounts']);
  }
}
