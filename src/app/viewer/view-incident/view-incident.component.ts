import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccountData,
  AccountsService,
} from 'src/app/services/accounts.service';
import { AttachmentsService } from 'src/app/services/attachments.service';
import { BuildingsService } from 'src/app/services/buildings.service';
import { BuildingData } from 'src/app/services/buildings.service';
import {
  FullReportData,
  ReportsService,
} from 'src/app/services/reports.service';

interface ObservationData {
  label: string;
  optionalLabel: string;
  value: number;
}

@Component({
  selector: 'app-view-incident',
  templateUrl: './view-incident.component.html',
  styleUrls: ['./view-incident.component.scss'],
})
export class ViewIncidentComponent {
  id: string = '';
  reportData: FullReportData | null = null;
  inspectorData: AccountData | null = null;
  observationData: ObservationData[] | null = null;
  buildingData: BuildingData | null = null;
  error: string = '';
  currentLoading: string = 'Initializing...';
  attachmentUrls:
    | {
        type: 'image' | 'video';
        url: string;
        thumbnail: string;
      }[]
    | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private title: Title,
    private reportsService: ReportsService,
    private accountsService: AccountsService,
    private buildingsService: BuildingsService,
    private attachmentsService: AttachmentsService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.id = params['id'];

      this.currentLoading = 'Retrieving report data...';
      this.reportData = await this.reportsService.tryGetReportAsync(this.id);
      if (!this.reportData) {
        this.router.navigate(['errors', 'notfound']);
        return;
      }
      this.reportData.evaluationComment.replace('\n', '&#10');
      console.log(this.reportData.evaluationComment);

      this.currentLoading = 'Retrieving inspector data...';
      this.inspectorData = await this.accountsService.getAccountDataAsync(
        this.reportData?.inspectorId ?? ''
      );
      if (!this.inspectorData) {
        this.error = 'Inspector user data could not be retrieved';
        return;
      }

      this.currentLoading = 'Retrieving building data...';
      this.buildingData = await this.buildingsService.getBuildingInfoAsync(
        this.reportData?.buildingId ?? ''
      );
      if (!this.buildingData) {
        this.error = 'Building data could not be retrieved';
        return;
      }

      this.currentLoading = 'Generating observation data...';
      this.observationData = this.generateObservationData(this.reportData);

      this.currentLoading = 'Fetching attachments...';
      const attachments =
        await this.attachmentsService.GetAttachmentsFromReportAsync(this.id);
      if (!attachments) {
        this.error = 'Attachments could not be retrieved';
        return;
      }
      const promise = attachments.map(async (attachmentId) => {
        const fullsize = await this.attachmentsService.GetAttachmentAsync(
          attachmentId,
          false
        );
        const thumbnail = await this.attachmentsService.GetAttachmentAsync(
          attachmentId,
          true
        );
        if (!fullsize || !thumbnail || !fullsize.contentType) return null;
        return {
          type: fullsize.contentType.split('/')[0] as 'image' | 'video',
          url: await this.attachmentsService.GetAttachmentUrlAsync(fullsize),
          thumbnail: await this.attachmentsService.GetAttachmentUrlAsync(
            thumbnail
          ),
        };
      });
      const results = await Promise.all(promise);
      this.attachmentUrls = results.filter(
        (attachment) => attachment !== null
      ) as {
        type: 'image' | 'video';
        url: string;
        thumbnail: string;
      }[];

      this.title.setTitle('Report Viewer - ACTION Dashboard Web App');
    });
  }

  generateObservationData(reportData: FullReportData): ObservationData[] {
    const data: ObservationData[] = [
      {
        label: 'Collapsed Structure',
        optionalLabel: '',
        value: reportData.collapsedStructure,
      },
      {
        label: 'Building or story leaning / out of plumb',
        optionalLabel: '',
        value: reportData.leaningOrOutOfPlumb,
      },
      {
        label: 'Damage to primary structural members, racking of walls',
        optionalLabel: '',
        value: reportData.damageToPrimaryStructure,
      },
      {
        label: 'Falling hazards such',
        optionalLabel: '',
        value: reportData.fallingHazards,
      },
      {
        label: 'Ground movement or slope',
        optionalLabel: '',
        value: reportData.groundMovementOrSlope,
      },
      {
        label: 'Damaged / submerged fixtures or services',
        optionalLabel: '',
        value: reportData.damagedSubmergedFixtures,
      },
      {
        label: 'Proximity risks / other (specify): ',
        optionalLabel: reportData.proximityRiskTitle,
        value: reportData.proximityRisk,
      },
    ];
    return data;
  }

  formatDateToShortDateString(date: Date): string {
    const oY: Intl.DateTimeFormatOptions = {
      year: '2-digit',
    };
    const oM: Intl.DateTimeFormatOptions = {
      month: 'short',
    };
    const oD: Intl.DateTimeFormatOptions = {
      day: '2-digit',
    };
    const y = date.toLocaleDateString('en-US', oY);
    const m = date.toLocaleDateString('en-US', oM).toUpperCase();
    const d = date.toLocaleDateString('en-US', oD);
    return `${d} ${m} ${y}`;
  }

  formatDateTo24TimeString(date: Date): string {
    var h = date.getHours().toString();
    if (h.length == 1) h = '0' + h;
    var m = date.getMinutes().toString();
    if (m.length == 1) m = '0' + m;
    return `${h}:${m}`;
  }

  isOtherConstructionType(data: string | undefined) {
    if (!data) return false;
    const types = ['wood', 'steel', 'concrete', 'masonry'];
    return !types.includes(data);
  }

  isOtherOccupancyType(data: string | undefined) {
    if (!data) return false;
    const types = [
      'singleFamily',
      'multiResidential',
      'emergencyServices',
      'industrial',
      'offices',
      'commercial',
      'school',
      'government',
    ];
    return !types.includes(data);
  }
  updateHideAttachmentsOption(event: any) {
    const attachmentsSection = document.getElementById('attachments-group');
    if (!attachmentsSection) return;
    if (event.target.checked) {
      attachmentsSection.classList.add('hide-on-print');
    } else {
      attachmentsSection.classList.remove('hide-on-print');
    }
  }
  updateHideNonImagesOption(event: any) {
    const attachmentsSection = document.getElementsByClassName('non-image');
    if (!attachmentsSection) return;
    if (event.target.checked) {
      for (let i = 0; i < attachmentsSection.length; i++) {
        attachmentsSection[i].classList.add('hide-on-print');
      }
    } else {
      for (let i = 0; i < attachmentsSection.length; i++) {
        attachmentsSection[i].classList.remove('hide-on-print');
      }
    }
  }

  updateShowImagesOption() {}

  print() {
    window.print();
  }
}
