import { Injectable } from '@angular/core';
import { LocationNode } from './../../shared/models/location-node';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  public userLocation: LocationNode | null = null;
  public endpoint: LocationNode | null = null;

  constructor() { }

}
