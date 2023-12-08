import {
  AfterContentInit,
  AfterViewChecked,
  Component,
  ElementRef,
  NgZone,
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
  map,
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
  map: Map | undefined;
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

  disableMapInteraction() {
    if (this.map == undefined) return;
    this.map.dragging.disable();
    this.map.touchZoom.disable();
    this.map.doubleClickZoom.disable();
    this.map.scrollWheelZoom.disable();
    this.map.boxZoom.disable();
    this.map.keyboard.disable();
    if (this.map.tap) this.map.tap.disable();
  }

  enableMapInteraction() {
    if (this.map == undefined) return;
    this.map.dragging.enable();
    this.map.touchZoom.enable();
    this.map.doubleClickZoom.enable();
    this.map.scrollWheelZoom.enable();
    this.map.boxZoom.enable();
    this.map.keyboard.enable();
    if (this.map.tap) this.map.tap.enable();
  }

  createMarker(
    latLng: LatLngExpression,
    title: string,
    locationId: string,
    status?: string
  ): Marker {
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
    let t = tooltip(
      {
        permanent: true,
        direction: 'right',
        className: 'map-tooltip',
        interactive: true,
      },
      m
    );
    const imgStatus = status
      ? `<div class="status ${status}"></div>`
      : '<img src="assets/svg/missing.svg" />';
    t.setContent(
      `<div class="status-container">${imgStatus}</div><span>${title}</span>`
    );
    t.on('click', (event) => {
      this.ngZone.run(() => {
        this.onLocationClick(locationId);
      });
    });
    m.bindTooltip(t);
    return m;
  }

  pabloBorbonMarker = this.createMarker(
    [13.754577003461083, 121.05307754447269],
    'Pablo Borbon',
    'pablo-borbon'
  );

  alangilanMarker = this.createMarker(
    [13.784783005382733, 121.07413429536747],
    'Alangilan',
    'alangilan'
  );

  nasugbuMarker = this.createMarker(
    [14.066609136873, 120.62622510689744],
    'ARASOF-Nasugbu',
    'nasugbu'
  );

  balayanMarker = this.createMarker(
    [13.948303545783645, 120.71990720669342],
    'Balayan',
    'balayan'
  );

  lemeryMarker = this.createMarker(
    [13.885194183542362, 120.91478831469341],
    'Lemery',
    'lemery'
  );

  mabiniMarker = this.createMarker(
    [13.7567593205059, 120.93703106152023],
    'Mabini',
    'mabini'
  );

  malvarMarker = this.createMarker(
    [14.044933904201448, 121.15589786610359],
    'JPLPC Malvar',
    'malvar'
  );

  lipaMarker = this.createMarker(
    [13.95678844261957, 121.16302484662576],
    'Lipa',
    'lipa'
  );

  rosarioMarker = this.createMarker(
    [13.846586403703967, 121.19696379160726],
    'Rosario',
    'rosario'
  );

  sanJuanMarker = this.createMarker(
    [13.802263255187363, 121.40371035953684],
    'San Juan',
    'san-juan'
  );

  loboMarker = this.createMarker(
    [13.641619662958908, 121.19246589626654],
    'Lobo',
    'lobo'
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

  constructor(
    private dashboardService: DashboardService,
    private buildingsService: BuildingsService,
    private router: Router,
    private route: ActivatedRoute,
    private ngZone: NgZone
  ) {}

  numberToStatus(num: number): string | undefined {
    switch (num) {
      case 0:
        return 'ok';
      case 1:
        return 'minor';
      case 2:
        return 'moderate';
      case 3:
        return 'severe';
      default:
        return undefined;
    }
  }

  updateMarkerStatus(marker: Marker, title: string) {
    const locationData = this.locations?.find((l) => l.locationName == title);
    const status = this.numberToStatus(locationData?.status ?? -1);
    console.log(`${title}: ${locationData}`);
    const newMarker = this.createMarker(
      marker.getLatLng(),
      title,
      locationData?.locationId ?? '',
      status
    );
    this.map?.removeLayer(marker);
    this.map?.addLayer(newMarker);
    return newMarker;
  }

  updateMarkerStatuses() {
    if (this.map == undefined) return;
    this.pabloBorbonMarker = this.updateMarkerStatus(
      this.pabloBorbonMarker,
      'Pablo Borbon'
    );
    this.alangilanMarker = this.updateMarkerStatus(
      this.alangilanMarker,
      'Alangilan'
    );
    this.nasugbuMarker = this.updateMarkerStatus(
      this.nasugbuMarker,
      'ARASOF-Nasugbu'
    );
    this.balayanMarker = this.updateMarkerStatus(this.balayanMarker, 'Balayan');
    this.lemeryMarker = this.updateMarkerStatus(this.lemeryMarker, 'Lemery');
    this.mabiniMarker = this.updateMarkerStatus(this.mabiniMarker, 'Mabini');
    this.malvarMarker = this.updateMarkerStatus(
      this.malvarMarker,
      'JPLPC-Malvar'
    );
    this.lipaMarker = this.updateMarkerStatus(this.lipaMarker, 'Lipa');
    this.rosarioMarker = this.updateMarkerStatus(this.rosarioMarker, 'Rosario');
    this.sanJuanMarker = this.updateMarkerStatus(
      this.sanJuanMarker,
      'San Juan'
    );
    this.loboMarker = this.updateMarkerStatus(this.loboMarker, 'Lobo');
    console.log('updated marker statuses');
  }

  async ngOnInit(): Promise<void> {
    if (!this.dashboardService.hasLocationData()) {
      this.disableMapInteraction();
      await this.updateLocations();
      this.updateMarkerStatuses();
      this.enableMapInteraction();
    }
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
  }
  async ngAfterContentInit(): Promise<void> {
    const locationParam = this.route.snapshot.queryParams['location'];
    if (locationParam) {
      this.onLocationClick(locationParam);
    }
    if (this.dashboardService.hasUpdatedBuildingInfo()) {
      this.disableMapInteraction();
      await this.updateLocations();
      this.updateMarkerStatuses();
      this.enableMapInteraction();
    }
  }

  async updateLocations() {
    this.locations = undefined;
    this.selectedCampus = undefined;
    this.contentTitle = undefined;
    this.locationData = undefined;
    this.disableMapInteraction();
    await this.dashboardService.updateLocationsAsync();
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
    this.updateMarkerStatuses();
    this.enableMapInteraction();
  }

  async updateLocation(locationId: string | undefined) {
    if (locationId == undefined) return;
    this.locationData = undefined;
    this.disableMapInteraction();
    await this.dashboardService.updateLocationAsync(locationId);
    let newLocations = this.dashboardService.getLocations();
    this.locations = newLocations;
    this.locationData = this.locations?.find(
      (location) => location.locationId === locationId
    );
    this.updateMarkerStatuses();
    this.enableMapInteraction();
  }

  onMapReady(map: Map) {
    this.map = map;
    map.invalidateSize();
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
        this.updateMarkerStatuses();
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

  async onViewInventory(buildingId: string | undefined) {
    if (buildingId == undefined) return;
    await this.router.navigate([
      'dashboard',
      'building',
      'inventory',
      this.selectedCampus,
      buildingId,
    ]);
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
