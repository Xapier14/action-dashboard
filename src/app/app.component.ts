import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'ACTION Dashboard Web App';
  constructor(private titleService: Title) {
    this.titleService.setTitle(this.title);
  }
  ngOnInit(): void {
    console.log('Hello!');
  }
}
