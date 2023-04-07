import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountData, AccountsService } from 'src/app/services/accounts.service';
import { FullReportData, ReportsService } from 'src/app/services/reports.service';

interface ObservationData {
  label: string;
  optionalLabel: string;
  value: number;
}

@Component({
  selector: 'app-view-incident',
  templateUrl: './view-incident.component.html',
  styleUrls: ['./view-incident.component.scss']
})
export class ViewIncidentComponent {
  id: string = '';
  reportData: FullReportData | null = null;
  inspectorData: AccountData | null = null;
  observationData: ObservationData[] | null = null;
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
      this.inspectorData = await this.accountsService.getAccountDataAsync(this.reportData?.inspectorId ?? '');
      if (!this.inspectorData) {
        this.error = 'Inspector user data could not be retrieved';
        return;
      }
      this.observationData = this.generateObservationData(this.reportData);
      this.title.setTitle('Report Viewer - ACTION Dashboard Web App');
    })
  }

  generateObservationData(reportData: FullReportData): ObservationData[] {
    const data: ObservationData[] = [
      {
        label: 'Collapsed Structure',
        optionalLabel : '',
        value: reportData.collapsedStructure
      },
      {
        label: 'Building or story leaning / out of plumb',
        optionalLabel : '',
        value: reportData.leaningOrOutOfPlumb
      },
      {
        label: 'Damage to primary structural members, racking of walls',
        optionalLabel : '',
        value: reportData.damageToPrimaryStructure
      },
      {
        label: 'Falling hazards such',
        optionalLabel : '',
        value: reportData.fallingHazards
      },
      {
        label: 'Ground movement or slope',
        optionalLabel : '',
        value: reportData.groundMovementOrSlope
      },
      {
        label: 'Damaged / submerged fixtures or services',
        optionalLabel : '',
        value: reportData.damagedSubmergedFixtures,
      },
      {
        label: 'Proximity risks / other (specify): ',
        optionalLabel : reportData.proximityRiskTitle,
        value: reportData.proximityRisk
      }
    ];
    return data;
  }

  formatDateToShortDateString(date: Date): string {
    const oY: Intl.DateTimeFormatOptions = {
      year: '2-digit'
    };
    const oM: Intl.DateTimeFormatOptions = {
      month: 'short'
    };
    const oD: Intl.DateTimeFormatOptions = {
      day: '2-digit'
    };
    const y = date.toLocaleDateString('en-US', oY);
    const m = date.toLocaleDateString('en-US', oM).toUpperCase();
    const d = date.toLocaleDateString('en-US', oD);
    return `${d} ${m} ${y}`;
  }

  formatDateTo24TimeString(date: Date): string {
    var h = date.getHours().toString();
    if (h.length == 1)
      h = '0' + h;
    var m = date.getMinutes().toString();
    if (m.length == 1)
      m = '0' + m;
    return `${h}:${m}`;
  }
}
