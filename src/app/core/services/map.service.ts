import { Injectable } from '@angular/core';
import { Path as SvgPath, Svg, SVG } from '@svgdotjs/svg.js';
import { STROKE_CONFIG } from 'src/app/feature/map/canva/canvas-config';
import { SvgPathUtils } from 'src/utils/svg-path.utils';
import { GuideMapRoomProperties } from '../models';
import { FloorService } from './floor.service';
import { MapPathService } from './map-path.service';

const WIDTH = 3500;
const HEIGHT = 2550;
const [width, height] = [WIDTH + 'px', HEIGHT + 'px'];

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(
    private readonly _floorService: FloorService,
    private readonly _mapPathService: MapPathService
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
  }

  public setFinalEndpoint(finalEndpoint: GuideMapRoomProperties): void {
    // TODO: refactor
    this._mapPathService.finalEndpoint$.next(finalEndpoint);
    this._mapPathService.calculateFullPath();
    this._drawPath();
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

  private _subscribeOnFloorChanges(): void {
    this._floorService.floor$.subscribe(() => {
      this._drawPath();
    });
  }

  private _drawPath(): void {
    // TODO: refactor
    this.clearPath();
    const currentPathCoordinates = this._mapPathService.getPathCoordinates();
    const {
      currentUserLocationPoint,
      currentUserEndpoint,
    } = this._mapPathService.pathPointsValues;

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
