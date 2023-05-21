import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AccountData,
  AccountsService,
} from 'src/app/services/accounts.service';
import { AttachmentsService } from 'src/app/services/attachments.service';
import {
  BuildingData,
  BuildingsService,
} from 'src/app/services/buildings.service';
import {
  FullReportData,
  ReportsService,
} from 'src/app/services/reports.service';

@Component({
  selector: 'app-edit-incident',
  templateUrl: './edit-incident.component.html',
  styleUrls: ['./edit-incident.component.scss'],
})
export class EditIncidentComponent {
  id: string = '';
  saved: boolean = false;
  reportData: FullReportData | null = null;
  inspectorData: AccountData | null = null;
  // observationData: ObservationData[] | null = null;
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

  collapsedStructure: number = 0;
  leaningOrOutOfPlumb: number = 0;
  damageToPrimaryStructure: number = 0;
  fallingHazards: number = 0;
  groundMovementOrSlope: number = 0;
  damagedSubmergedFixtures: number = 0;
  proximityRiskTitle: string = '';
  proximityRisk: number = 0;

  constructor(
    private reportsService: ReportsService,
    private accountsService: AccountsService,
    private buildingsService: BuildingsService,
    private attachmentsService: AttachmentsService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id') ?? '';
    this.currentLoading = 'Retrieving report data...';
    this.reportData = await this.reportsService.tryGetReportAsync(this.id);
    if (!this.reportData) {
      this.router.navigate(['errors', 'notfound']);
      return;
    }

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

    this.currentLoading = 'Pre-filling forms...';
    this.revertChanges();

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

  revertChanges() {
    if (!this.reportData) return;
    this.collapsedStructure = this.reportData.collapsedStructure;
    this.leaningOrOutOfPlumb = this.reportData.leaningOrOutOfPlumb;
    this.damageToPrimaryStructure = this.reportData.damageToPrimaryStructure;
    this.fallingHazards = this.reportData.fallingHazards;
    this.groundMovementOrSlope = this.reportData.groundMovementOrSlope;
    this.damagedSubmergedFixtures = this.reportData.damagedSubmergedFixtures;
    this.proximityRiskTitle = this.reportData.proximityRiskTitle;
    this.proximityRisk = this.reportData.proximityRisk;
  }

  saveChanges() {
    this.saved = true;
  }
}
