import { Component } from '@angular/core';
import { environment } from './../../../environments/environment';
import { LocationNode } from './../../shared/models/location-node';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  public floor: number = environment.defaultFloor;
  public userLocation: LocationNode | null = null;
  public endpoint: LocationNode;
  public isGoto = false;

  constructor() { }
}
