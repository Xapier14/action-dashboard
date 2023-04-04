import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-incident',
  templateUrl: './view-incident.component.html',
  styleUrls: ['./view-incident.component.scss']
})
export class ViewIncidentComponent {
  id: string = '';
  constructor(private route: ActivatedRoute,
              private title: Title) {}

  ngOnInit() {
    this.title.setTitle('Report Viewer - ACTION Dashboard Web App');
    this.route.params.subscribe(params => {
      this.id = params['id'];
    })
  }
}
