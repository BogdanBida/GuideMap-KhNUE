import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocationNode } from '../models/location-node';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private $userLocation = new BehaviorSubject<LocationNode | null>(null);
  private $endpoint = new BehaviorSubject<LocationNode | null>(null);
  public gotoClickEvent = new Observable();

  public set userLocation(value: LocationNode | null) {
    this.$userLocation.next(value);
  }
  public get userLocation(): LocationNode | null { return this.$userLocation.value; }

  public set endpoint(value: LocationNode | null) {
    this.$endpoint.next(value);
  }
  public get endpoint(): LocationNode | null { return this.$endpoint.value; }

  public getUserLocationBehaviorSubject(): BehaviorSubject<LocationNode | null> {
    return this.$userLocation;
  }

  public getEndpointBehaviorSubject(): BehaviorSubject<LocationNode | null> {
    return this.$endpoint;
  }

  constructor() { }
}
