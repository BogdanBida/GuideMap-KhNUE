/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { Circle } from '@svgdotjs/svg.js';
import {
  ENDPOINT_COLOR,
  STAIRS_ENDPOINT_COLOR,
  USER_LOC_COLOR as USER_LOCATION_COLOR,
} from 'src/app/feature/map/canva/canvas-config';
import { GuideMapRoomProperties } from '../models';
import { MapPathService } from './map-path.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class MapDotService {
  constructor(
    private readonly _mapPathService: MapPathService,
    private readonly _mapService: MapService
  ) {}

  public userDot: Circle;

  public endpointDot: Circle;

  public drawUserLocation(location: GuideMapRoomProperties): void {
    this.userDot = this.drawPoint(this.userDot, location, USER_LOCATION_COLOR);
  }

  public init(): void {
    this._subscribeOnStairsLocationChanges();
    this._subscribeOnPathCoordinatesChanges();
  }

  public drawPoint(
    Dot: Circle,
    location: GuideMapRoomProperties,
    color: string = '#505050'
  ): Circle {
    if (Dot) {
      Dot.remove();
    }

    if (this._mapService.svgInstance && location) {
      const radius = 25;
      const maxRadius = 500;
      const { x, y } = location;

      Dot = this._mapService.svgInstance
        .circle(maxRadius)
        .attr({ fill: color, opacity: 0 })
        .move(x - maxRadius / 2, y - maxRadius / 2);
      Dot.animate({ duration: 2500 })
        .size(radius, radius)
        .attr({ fill: color, opacity: 0.75 });
      Dot.animate({ ease: '<' });
      Dot.animate({ duration: 1000, ease: '<>' })
        .loop(Infinity, true)
        .size(radius + 20, radius + 20)
        .attr({ opacity: 0.4 });
    }

    return Dot;
  }

  private _subscribeOnPathCoordinatesChanges(): void {
    this._mapPathService.pathCoordinatesChanges$.subscribe(([, endPoint]) => {
      if (endPoint) {
        this.endpointDot = this.drawPoint(
          this.endpointDot,
          endPoint,
          ENDPOINT_COLOR
        );
      }
    });
  }

  private _subscribeOnStairsLocationChanges(): void {
    this._mapPathService.stairsMiddlePoint$.subscribe((stairsEndPoint) => {
      if (stairsEndPoint) {
        this.endpointDot = this.drawPoint(
          this.endpointDot,
          stairsEndPoint,
          STAIRS_ENDPOINT_COLOR
        );
      }
    });
  }
}
