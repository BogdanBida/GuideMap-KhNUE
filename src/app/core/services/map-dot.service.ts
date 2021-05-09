/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import { Circle, Use } from '@svgdotjs/svg.js';
import { GuideMapFeaturePointCategory } from '../enums';
import { GuideMapRoomProperties } from '../models';
import { MapPointUtils } from '../utils';
import { FloorService } from './floor.service';
import { MapPathService } from './map-path.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class MapDotService {
  constructor(
    private readonly _mapPathService: MapPathService,
    private readonly _mapService: MapService,
    private readonly _floorService: FloorService
  ) {}

  public userDot: Circle;

  public endpointDot: Circle;

  public stairsFloorSwitcher: Use;

  public init(): void {
    this._subscribeOnPathCoordinatesChanges();
  }

  public drawPoint(
    Dot: Circle,
    location: GuideMapRoomProperties,
    isEndpoint = true
  ): Circle {
    const pointColor = MapPointUtils.getPointColor(
      location?.category,
      isEndpoint
    );

    if (Dot) {
      Dot.remove();
    }

    if (this._mapService.svgInstance && location) {
      const radius = 25;
      const maxRadius = 500;
      const maxRadiusHalf = maxRadius / 2;
      const { x, y } = location;

      Dot = this._mapService.svgInstance
        .circle(maxRadius)
        .attr({ fill: pointColor, opacity: 0 })
        .move(x - maxRadiusHalf, y - maxRadiusHalf);

      Dot.animate({ duration: 2500 })
        .size(radius, radius)
        .attr({ fill: pointColor, opacity: 0.75 });

      Dot.animate({ ease: '<' });

      Dot.animate({ duration: 1000, ease: '<>' })
        .loop(Infinity, true)
        .size(radius + 20, radius + 20)
        .attr({ opacity: 0.4 });
    }

    return Dot;
  }

  private _subscribeOnPathCoordinatesChanges(): void {
    this._mapPathService.pathCoordinatesChanges$.subscribe(
      ([userLocation, endPoint]) => {
        this.endpointDot = this.drawPoint(this.endpointDot, endPoint);
        this.userDot = this.drawPoint(this.userDot, userLocation, false);
        this._drawFloorSwitcher([userLocation, endPoint]);
      }
    );
  }

  private _drawFloorSwitcher(points: GuideMapRoomProperties[]): void {
    const stairsPointIndex = points.findIndex(
      (point) => point?.category === GuideMapFeaturePointCategory.Stairs
    );

    this.stairsFloorSwitcher?.remove();

    if (stairsPointIndex === 0) {
      this.stairsFloorSwitcher = this._drawArrow(
        points[stairsPointIndex],
        'arrow-down-d'
      );

      return;
    }

    if (stairsPointIndex > -1) {
      this.stairsFloorSwitcher = this._drawArrow(
        points[stairsPointIndex],
        'arrow-up'
      );
    }
  }

  private _drawArrow(
    stairsPoint: GuideMapRoomProperties,
    arrowDirection = 'arrow-up'
  ): Use {
    return this._mapService.svgInstance
      .use(arrowDirection, 'assets/icons/sprite.svg')
      .attr(
        'style',
        `
        filter: drop-shadow(0 2px 1px rgba(0, 0, 0, 0.5))
                drop-shadow(1px 3px 2px rgba(0, 0, 0, 0.4))
                drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3));
        pointer-events: all;
        cursor: pointer;
    `
      )
      .size(50, 50)
      .id(arrowDirection)
      .move(stairsPoint.x - 25, stairsPoint.y - 80)
      .click(() => this._onFloorSwitcherClick(arrowDirection));
  }

  private _onFloorSwitcherClick(arrowDirection: string): void {
    if (arrowDirection === 'arrow-up') {
      const finalEndpoint = this._mapPathService.finalEndpoint$.getValue();

      this._floorService.floor = finalEndpoint.floor;
    } else {
      const startPoint = this._mapPathService.startPoint$.getValue();

      this._floorService.floor = startPoint.floor;
    }
  }
}
