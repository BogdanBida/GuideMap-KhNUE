import { Injectable } from '@angular/core';
import { Path as SvgPath, Svg, SVG } from '@svgdotjs/svg.js';
import { tap, withLatestFrom } from 'rxjs/operators';
import { STROKE_CONFIG } from 'src/app/feature/map/canva/canvas-config';
import { SvgPathUtils } from 'src/utils/svg-path.utils';
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
    this.svgInstance = SVG().addTo('#canv').size(width, height);
    console.log(this.svgInstance);
    this.svgBackgroundInstance = SVG().addTo('#bgr-canv').size(width, height);
    this.drawBackground();
  }

  public drawBackground(): void {
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

  public drawPath(): void {
    this._mapPathService
      .getPathCoordinates$()
      .pipe(
        withLatestFrom(this._mapPathService.pathPoints$),
        tap(([coordinates, pathPoints]) => {
          this.clearPath();
          const { userLocation, endpoint, stairsMiddlePoint } = pathPoints;
          const currentEndPoint = stairsMiddlePoint ?? endpoint;
          const properties = userLocation;
          // todo: change to find path data by user and endpoint
          // const path = this.path[properties.id + '-' + endpoint.id];
          const points: number[][] = [
            [properties.x, properties.y],
            ...coordinates.map(({ x, y }) => [x, y]),
            [currentEndPoint.x, currentEndPoint.y],
          ];
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
        })
      )
      .subscribe();
  }
}
