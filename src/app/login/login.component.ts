import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpService } from '../services/http.service';
import { environment } from 'src/environments/environment';
import { RecaptchaService } from '../services/recaptcha.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm;
  loading = false;
  error = '';
  connected = false;
  serverNotAvailable = false;
  connectionStatus = 'Contacting server...';
  statusCode = 'working';

  private recaptcha: any;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private httpService: HttpService,
    private recaptchaService: RecaptchaService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: '',
      password: '',
    });
  }

  async ngOnInit(): Promise<void> {
    const connected = await this.httpService.testConnection();
    if (connected) {
      this.connectionStatus = 'Waiting for reCAPTCHA to load...';
      await this.recaptchaService.showBadge();
      if (this.recaptchaService.hasError) {
        this.serverNotAvailable = true;
        this.connectionStatus = 'reCAPTCHA failed to load.';
        this.statusCode = 'error';
        return;
      }
      this.connectionStatus = 'Connected.';
      this.statusCode = 'success';
      setTimeout(() => {
        this.connected = true;
      }, 1500);
    } else {
      this.serverNotAvailable = true;
      this.connectionStatus = 'Server could not be reached.';
      this.statusCode = 'error';
    }
    if (this.authService.hasToken()) {
      this.router.navigate(['/dashboard']);
      await this.recaptchaService.hideBadge();
    }
  }

  async ngOnDestroy(): Promise<void> {
    this.recaptchaService.hideBadge();
  }

  async onSubmit() {
    this.loading = true;
    this.error = '';
    this.recaptchaService.ready(async () => {
      const email = this.loginForm.value.email;
      const password = this.loginForm.value.password;
      const token = await this.recaptchaService.getToken('login');
      if (!token) {
        this.error = 'ReCaptcha failed.';
        this.loading = false;
        return;
      }
      if (email && password) {
        const result = await this.authService.tryLogin(
          email,
          password,
          token,
          1
        );
        this.checkLoginResult(result);
      } else {
        this.error = 'Please fill all fields.';
      }
      this.loading = false;
      console.log(this.error);
    });
  }

  checkLoginResult(result: { e: any; status: string }) {
    switch (result.e) {
      case 0:
        // login successful
        this.router.navigate(['/dashboard']);
        // clear fields
        this.loginForm.reset();
        break;
      case 1:
        // invalid email
        this.error = 'Invalid credentials.';
        this.loginForm.setValue({
          email: this.loginForm.value.email ?? '',
          password: '',
        });
        break;
      case 5:
        // insufficient permissions
        this.error = 'Account unauthorized.';
        this.loginForm.setValue({
          email: this.loginForm.value.email ?? '',
          password: '',
        });
        break;
      case 8:
        // too many requests
        this.error = 'Too many requests. Please try again later.';
        this.loginForm.setValue({
          email: this.loginForm.value.email ?? '',
          password: '',
        });
        break;
      default:
        this.error = result.status;
        break;
    }
  }
}
