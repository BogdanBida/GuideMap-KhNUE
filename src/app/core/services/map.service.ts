import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Path as SvgPath, Svg, SVG } from '@svgdotjs/svg.js';
import { isNil } from 'lodash-es';
import { STROKE_CONFIG } from 'src/app/shared/constants';
import { environment } from 'src/environments/environment';
import { GuideMapFeaturePointRoom, GuideMapRoomProperties } from '../models';
import { SvgPathUtils } from '../utils';
import { FloorService } from './floor.service';
import { MapDataProviderService } from './map-data-provider.service';
import { MapPathService } from './map-path.service';

const WIDTH = environment.map.mapWidth;
const HEIGHT = environment.map.mapHeight;
const [width, height] = [WIDTH + 'px', HEIGHT + 'px'];

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(
    private readonly _floorService: FloorService,
    private readonly _mapPathService: MapPathService,
    private readonly _mapDataProviderService: MapDataProviderService
  ) {}

  public svgInstance: Svg;

  public svgBackgroundInstance: Svg;

  public svgPathInstance: SvgPath;

  public init(): void {
    // TODO: refactor
    this.svgInstance = SVG().addTo('#canv').size(width, height);
    this.svgBackgroundInstance = SVG().addTo('#bgr-canv').size(width, height);
    this.drawBackground();
    this._subscribeOnFloorChanges();
    this._subscribeOnStartPointChanges();
  }

  public setFinalEndpoint(finalEndpoint: GuideMapRoomProperties): void {
    // TODO: refactor
    this._mapPathService.setFinalEndPoint(finalEndpoint);

    if (isNil(this._mapPathService.startPoint$.value)) {
      return;
    }

    this._mapPathService.calculateFullPath();
    this._drawPath();
  }

  public setUserLocation(qrCodeLocation: GuideMapRoomProperties): void {
    // TODO: refactor
    this._mapPathService.setStartPoint(qrCodeLocation);

    if (isNil(this._mapPathService.finalEndpoint$.value)) {
      return;
    }

    this._mapPathService.calculateFullPath();
    this._drawPath();
  }

  /**
   * @return (boolean) false - if point not found and not set to state
   */
  public findAndSetLocationById(id: string): boolean {
    // ! HOTFIX (add all points as start points)
    const location = (
      this._mapDataProviderService.qrCodesAndRooms as GuideMapFeaturePointRoom[]
    ).find((node) => String(node.properties.id) === id);

    console.log(location);

    location && this.setUserLocation(location.properties);

    return !!location;
  }

  /**
   * @return (boolean) false - if point not found and not set to state
   */
  public findAndSetEndpointById(id: string): boolean {
    const destination = (
      this._mapDataProviderService.qrCodesAndRooms as GuideMapFeaturePointRoom[]
    ).find((node) => String(node.properties.id) === id);

    destination && this.setFinalEndpoint(destination.properties);

    return !!destination;
  }

  public findAndSetEndpointByName(destinationName: string): void {
    // ! HOTFIX (add all points as start points)
    const foundEndpoint = (
      this._mapDataProviderService.qrCodesAndRooms as GuideMapFeaturePointRoom[]
    ).find((roomNode) => {
      return destinationName === roomNode.properties.name;
    });

    foundEndpoint &&
      this.setFinalEndpoint(
        foundEndpoint.properties as unknown as GuideMapRoomProperties
      );
  }

  public findAndSetLocationByName(userLocation: string): void {
    // ! HOTFIX (add all points as start points)
    const foundLocation = (
      this._mapDataProviderService.qrCodesAndRooms as GuideMapFeaturePointRoom[]
    ).find((roomNode) => {
      return userLocation === roomNode.properties.name;
    });

    foundLocation &&
      this.setUserLocation(
        foundLocation.properties as unknown as GuideMapRoomProperties
      );
  }

  public drawBackground(): void {
    // TODO: refactor
    const floorImageName = this._floorService.getFloorImageName();

    if (this.svgBackgroundInstance && floorImageName) {
      this.svgBackgroundInstance.clear();
      this.svgBackgroundInstance
        .image('assets/floor-plans/' + floorImageName)
        .size('100%', '100%');
    }
  }

  public clearPath(): void {
    if (this.svgPathInstance) {
      this.svgPathInstance.remove();
    }
  }

  private _subscribeOnStartPointChanges(): void {
    this._mapPathService.currentPointsChanges$
      .pipe(untilDestroyed(this))
      .subscribe(({ floor }) => {
        const isStartPointOnOtherFloor = this._floorService.floor !== floor;

        if (isStartPointOnOtherFloor) {
          this._floorService.floor = floor;
        }
      });
  }

  private _subscribeOnFloorChanges(): void {
    this._floorService.floor$.pipe(untilDestroyed(this)).subscribe(() => {
      this._drawPath();
    });
  }

  private _drawPath(): void {
    // TODO: refactor
    this.clearPath();
    const currentPathCoordinates = this._mapPathService.getPathCoordinates();
    const { currentUserLocationPoint, currentUserEndpoint } =
      this._mapPathService.pathPointsValues;

    const properties = currentUserLocationPoint;

    if (!currentUserLocationPoint && !currentUserEndpoint) {
      return;
    }

    const points: number[][] = [
      [properties.x, properties.y],
      ...currentPathCoordinates.map(({ x, y }) => [x, y]),
      [currentUserEndpoint.x, currentUserEndpoint.y],
    ];

    this._animatePath(points);
  }

  private _animatePath(points: number[][]): void {
    // TODO: refactor
    const pathString = points.reduce((acc, point, i, a) => {
      return i === 0
        ? `M ${point[0]},${point[1]}`
        : `${acc} ${SvgPathUtils.bezierCommand(point, i, a)}`;
    }, '');

    this.svgPathInstance = this.svgInstance
      .path(pathString)
      .stroke(STROKE_CONFIG)
      .fill({
        color: '#00000000',
      })
      .attr({
        'stroke-dashoffset': '0',
      });
    this.svgPathInstance
      .animate({ duration: 4000, ease: '>' })
      .loop(1, false)
      .attr({
        'stroke-dashoffset': '-70',
      });
  }
}
