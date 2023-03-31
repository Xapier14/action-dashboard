import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm;
  loading = false;
  error = '';
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: '',
    });
  }

  ngOnInit(): void {
    if (this.authService.hasToken()) {
      this.router.navigate(['/dashboard']);
    }
  }

  async onSubmit() {
    this.loading = true;
    this.error = '';
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
    if (email && password) {
      const result = await this.authService.tryLogin(email, password, 1);
      console.log(result);
      this.checkLoginResult(result);
    } else {
      this.error = 'Please fill all fields.';
    }
    this.loading = false;
    console.log(this.error);
  }

  checkLoginResult(result: { e: any; status: string }) {
    switch (result.e) {
      case 0:
        // login successfull
        this.router.navigate(['/dashboard']);
        // clear fields
        this.loginForm.reset();
        break;
      case 1:
        // invalid email
        this.error = 'Invalid credentials.';
        break;
      case 5:
        // invalid email
        this.error = 'Account unauthorized.';
        break;
      case 8:
        // invalid email
        this.error = 'Too many login attempts. Please try again later.';
        break;
      default:
        this.error = result.status;
        break;
    }
  }
}
