import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  DivIconOptions,
  LatLngBoundsExpression,
  LatLngExpression,
  Map,
  Marker,
  MarkerOptions,
  divIcon,
  icon,
  latLng,
  marker,
  tileLayer,
  tooltip,
} from 'leaflet';
import { AccountsService } from 'src/app/services/accounts.service';
import { BuildingsService } from 'src/app/services/buildings.service';
import {
  DashboardService,
  LocationData,
} from 'src/app/services/dashboard.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit, AfterContentInit {
  @ViewChild('leafletMap') map: Map | undefined;
  selectedCampus: string | undefined;
  locationData: LocationData | undefined;
  contentTitle: string | undefined;
  locations: LocationData[] | undefined;

  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution:
      '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });
  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution:
      '<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  });

  pabloBorbonMarker = this.createMarker(
    [13.754577003461083, 121.05307754447269],
    'Pablo Borbon'
  );

  alangilanMarker = this.createMarker(
    [13.784783005382733, 121.07413429536747],
    'Alangilan'
  );

  nasugbuMarker = this.createMarker(
    [14.066609136873, 120.62622510689744],
    'ARASOF-Nasugbu'
  );

  balayanMarker = this.createMarker(
    [13.948303545783645, 120.71990720669342],
    'Balayan'
  );

  lemeryMarker = this.createMarker(
    [13.885194183542362, 120.91478831469341],
    'Lemery'
  );

  mabiniMarker = this.createMarker(
    [13.7567593205059, 120.93703106152023],
    'Mabini'
  );

  malvarMarker = this.createMarker(
    [14.044933904201448, 121.15589786610359],
    'JPLPC Malvar'
  );

  lipaMarker = this.createMarker(
    [13.95678844261957, 121.16302484662576],
    'Lipa'
  );

  rosarioMarker = this.createMarker(
    [13.846586403703967, 121.19696379160726],
    'Rosario'
  );

  sanJuanMarker = this.createMarker(
    [13.802263255187363, 121.40371035953684],
    'San Juan'
  );

  loboMarker = this.createMarker(
    [13.641619662958908, 121.19246589626654],
    'Lobo'
  );

  leafletOptions = {
    layers: [
      this.streetMaps,
      this.pabloBorbonMarker,
      this.alangilanMarker,
      this.nasugbuMarker,
      this.balayanMarker,
      this.lemeryMarker,
      this.mabiniMarker,
      this.malvarMarker,
      this.lipaMarker,
      this.rosarioMarker,
      this.sanJuanMarker,
      this.loboMarker,
    ],
    zoom: 10,
    center: latLng(13.88, 121.05),
  };

  createMarker(latLng: LatLngExpression, title: string): Marker {
    // create marker with tooltip
    let markerOptions: MarkerOptions = {
      icon: icon({
        iconSize: [25, 41],
        iconAnchor: [13, 41],
        iconUrl: 'assets/svg/marker.svg',
        tooltipAnchor: [12, -20],
      }),
      title: title,
    };
    let m = marker(latLng, markerOptions);
    m.bindTooltip(title, {
      permanent: true,
      direction: 'right',
      className: 'map-tooltip',
    });
    return m;
  }

  constructor(
    private dashboardService: DashboardService,
    private buildingsService: BuildingsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    if (!this.dashboardService.hasLocationData()) await this.updateLocations();
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
  }

  async ngAfterContentInit(): Promise<void> {
    const locationParam = this.route.snapshot.queryParams['location'];
    if (locationParam) {
      this.onLocationClick(locationParam);
    }
    if (this.dashboardService.hasUpdatedBuildingInfo())
      await this.updateLocations();
  }

  async updateLocations() {
    this.locations = undefined;
    this.selectedCampus = undefined;
    this.contentTitle = undefined;
    this.locationData = undefined;
    await this.dashboardService.updateLocationsAsync();
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
  }

  async updateLocation(locationId: string | undefined) {
    if (locationId == undefined) return;
    this.locationData = undefined;
    await this.dashboardService.updateLocationAsync(locationId);
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
    this.locationData = this.locations?.find(
      (location) => location.locationId === locationId
    );
  }

  async onLocationClick(locationId: string | undefined) {
    if (this.locations == undefined) return;
    // set content title
    this.contentTitle = this.locations.find(
      (location) => location.locationId === locationId
    )?.locationName;

    if (locationId == undefined) {
      // set timeout
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 100);
    }
    if (this.selectedCampus === locationId) return;
    this.selectedCampus = locationId;
    if (!locationId) return;
    this.locationData = this.locations.find(
      (location) => location.locationId === locationId
    );
  }

  async onAddBuilding(locationId: string | undefined) {
    if (locationId == undefined) return;
    await this.router.navigate(['dashboard', 'building', 'add', locationId]);
  }

  async onEditBuilding(buildingId: string | undefined) {
    if (buildingId == undefined) return;
    await this.router.navigate(['dashboard', 'building', 'edit', buildingId]);
  }

  async onDeleteBuilding(buildingId: string | undefined) {
    if (
      confirm(
        'Are you sure you want to delete this building?\nThis will also delete all the reports associated with this building.'
      )
    ) {
      if (buildingId == undefined) return;
      await this.buildingsService.deleteBuildingAsync(buildingId);
      await this.updateLocation(this.selectedCampus);
    }
  }

  async onShowReport(id: string | undefined) {
    if (id == undefined) return;
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`/viewer/incident/${id}`])
    );

    window.open(url, '_blank');
  }

  generateTooltip(dateString: string | undefined): string {
    if (dateString == undefined) return '';
    let date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  }
}
