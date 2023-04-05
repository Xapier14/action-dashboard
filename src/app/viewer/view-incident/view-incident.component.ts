import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountData, AccountsService } from 'src/app/services/accounts.service';
import { FullReportData, ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-view-incident',
  templateUrl: './view-incident.component.html',
  styleUrls: ['./view-incident.component.scss']
})
export class ViewIncidentComponent {
  id: string = '';
  reportData: FullReportData | null = null;
  inspectorData: AccountData | null = null;
  error: string = '';
  constructor(private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private reportsService: ReportsService,
              private accountsService: AccountsService) {}

  ngOnInit() {
    this.route.params.subscribe(async params => {
      this.id = params['id'];
      this.reportData = await this.reportsService.tryGetReportAsync(this.id);
      if (!this.reportData) {
        this.router.navigate(['errors', 'notfound']);
        return;
      }
      console.log(this.reportData);
      this.inspectorData = await this.accountsService.getAccountDataAsync(this.reportData?.inspectorId ?? '');
      if (!this.inspectorData) {
        this.error = 'Inspector user data could not be retrieved';
        return;
      }
      this.title.setTitle('Report Viewer - ACTION Dashboard Web App');
    })
  }
}
