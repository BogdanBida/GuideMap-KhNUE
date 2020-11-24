import { LocationNode } from './../../shared/models/location-node';
import { Component } from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent {

  public floor: number;
  public userLocation: LocationNode;
  public endpoint: LocationNode;

  constructor() { this.floor = 1; }
}
