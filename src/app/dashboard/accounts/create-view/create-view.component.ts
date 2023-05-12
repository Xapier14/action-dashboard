import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AccountData,
  AccountsService,
} from 'src/app/services/accounts.service';

@Component({
  selector: 'app-create-view',
  templateUrl: './create-view.component.html',
  styleUrls: ['./create-view.component.scss'],
})
export class CreateViewComponent {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  location: string | undefined;
  maxAccessLevel: number | undefined;
  password: string | undefined;
  confirmPassword: string | undefined;

  constructor(
    private router: Router,
    private accountsService: AccountsService
  ) {}

  async createAccount() {
    if (this.firstName === undefined || this.firstName === '') return;
    if (this.email === undefined || this.email === '') return;
    if (this.location === undefined || this.location === '') return;
    if (this.maxAccessLevel === undefined) return;
    if (this.password === undefined || this.password === '') return;
    const data: AccountData = {
      id: undefined,
      firstName: this.firstName,
      lastName: this.lastName ?? '',
      email: this.email,
      location: this.location,
      maxAccessLevel: this.maxAccessLevel,
    };
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    const password = this.password;
    const result = this.accountsService.createAccountAsync(data, password);
    if (!result) {
      alert('Failed to create account!');
      return;
    }
    await this.router.navigate(['dashboard', 'accounts']);
  }

  async goBack() {
    await this.router.navigate(['dashboard', 'accounts']);
  }
}
