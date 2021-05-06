import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import {
  GuideMapCorridorProperties,
  GuideMapFeaturePoint,
  GuideMapRoomProperties,
  GuideMapSimpleRoute,
} from '../models';
import { FloorService } from './floor.service';
import { MapGraphService } from './map-graph.service';
import { MapPointsService } from './map-points.service';

@Injectable({
  providedIn: 'root',
})
export class MapPathService {
  constructor(
    private readonly _mapPointsService: MapPointsService,
    private readonly _mapGraphService: MapGraphService,
    private readonly _floorService: FloorService
  ) {}

  public readonly userLocation$ = new BehaviorSubject<GuideMapRoomProperties>(
    null
  );

  public readonly endpoint$ = new BehaviorSubject<GuideMapRoomProperties>(null);

  public readonly stairsMiddlePoint$ = new BehaviorSubject<GuideMapRoomProperties>(
    null
  );

  public readonly endPointId$ = this.endpoint$.pipe(
    map((endpoint) => endpoint?.id)
  );

  public readonly userLocationId$ = this.userLocation$.pipe(
    map((userLocation) => userLocation?.id)
  );

  public drawPath(): void {
    const stairsMiddlePointValue = this.stairsMiddlePoint$.getValue();

    this.userLocation$.next(stairsMiddlePointValue);
    this.stairsMiddlePoint$.next(null);
  }

  public getPathCoordinates$(): Observable<{ x: number; y: number }[]> {
    return this._floorService.floor$.pipe(
      withLatestFrom(
        this._mapPointsService.allPoints$,
        this.userLocationId$,
        this.endPointId$
      ),
      map(([floor, allPoints, userLocationId, endPointId]) => {
        const path = this._mapGraphService.findPath(
          userLocationId,
          endPointId,
          [],
          allPoints
        );
        const pathCoordinates = this._fillDataOfPath(path, floor, allPoints);

        return pathCoordinates;
      })
    );
  }

  private _fillDataOfPath(
    path: GuideMapSimpleRoute[],
    floor: number,
    points: GuideMapFeaturePoint[]
  ): { x: number; y: number }[] {
    const fullPath: number[] = path.map((item) => item.end);

    const fullPathWithCorridors = fullPath.map((pointId) => {
      const foundedCorridor = points.find(
        (item) => item.properties.id === pointId
      );

      return foundedCorridor;
    });

    const fullFuckingPath = [];

    for (const i in fullPathWithCorridors) {
      if (
        (fullPathWithCorridors[i].properties as GuideMapCorridorProperties)
          .floor !== floor
      ) {
        break;
      } else {
        fullFuckingPath.push(fullPathWithCorridors[i].properties as any);
      }
    }
    const isStairsInPathFounded = fullFuckingPath.find(
      (item, index) => item.isStairs && index !== 0
    );

    if (isStairsInPathFounded) {
      this.stairsMiddlePoint$.next(isStairsInPathFounded);
    }

    const corridors = fullFuckingPath.filter(
      (item) => item.category === 'corridor' && !item.isStairs
    );

    return corridors.map(({ x, y }) => ({ x, y }));
  }
}
