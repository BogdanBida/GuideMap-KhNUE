import { Component } from '@angular/core';
import { LocationNode } from './../../shared/models/location-node';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  public floor: number;
  public userLocation: LocationNode;
  public endpoint: LocationNode;

  constructor() {}
}
