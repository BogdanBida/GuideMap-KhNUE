import { Injectable } from '@angular/core';
import { isArray } from 'lodash';
import { BehaviorSubject, combineLatest, merge } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { positiveValue } from 'src/app/shared/operators';
import { GuideMapFeaturePointCategory } from '../enums';
import { ICoordinates } from '../interfaces';
import {
  GuideMapFeaturePoint,
  GuideMapRoomProperties,
  GuideMapSimpleRoute,
} from '../models';
import { MapPathUtils } from '../utils/map-path.utils';
import { FloorService } from './floor.service';
import { MapDataProviderService } from './map-data-provider.service';
import { MapGraphService } from './map-graph.service';

@Injectable({
  providedIn: 'root',
})
export class MapPathService {
  constructor(
    private readonly _mapDataProviderService: MapDataProviderService,
    private readonly _mapGraphService: MapGraphService,
    private readonly _floorService: FloorService
  ) {}

  public readonly startPoint$ = new BehaviorSubject<GuideMapRoomProperties>(
    null
  );

  public readonly finalEndpoint$ = new BehaviorSubject<GuideMapRoomProperties>(
    null
  );

  public readonly points$ = combineLatest([
    this.startPoint$,
    this.finalEndpoint$,
  ]);

  public readonly selectedUserLocationName$ = this.startPoint$.pipe(
    positiveValue(),
    map((point) => point.name)
  );

  public readonly selectedDestinationName$ = this.finalEndpoint$.pipe(
    positiveValue(),
    map((point) => point.name)
  );

  public readonly currentUserLocationPoint$ =
    new BehaviorSubject<GuideMapRoomProperties>(null);

  public readonly currentUserEndpoint$ =
    new BehaviorSubject<GuideMapRoomProperties>(null);

  public readonly fullPath$ = new BehaviorSubject<GuideMapSimpleRoute[]>([]);

  public readonly fullPathProperties$ = this.fullPath$.pipe(
    map((fullPath) => {
      const uniqPathIds = MapPathUtils.getUniquePathIds(fullPath);
      const fullPathProperties = MapPathUtils.getPathProperties(
        uniqPathIds,
        this._mapDataProviderService.allPoints
      );

      return fullPathProperties;
    })
  );

  public readonly calculatedPositiveStartPoint$ = this.startPoint$.pipe(
    switchMap(() => this.currentUserLocationPoint$.pipe(positiveValue()))
  );

  public readonly calculatedPositiveEndPoint$ = this.finalEndpoint$.pipe(
    switchMap(() => this.currentUserEndpoint$.pipe(positiveValue()))
  );

  public readonly currentPointsChanges$ = merge(
    this.calculatedPositiveStartPoint$,
    this.calculatedPositiveEndPoint$
  );

  public readonly startPointFloorChanges$ = merge(
    this.calculatedPositiveStartPoint$,
    this._floorService.floor$
  );

  public readonly endPointFloorChanges$ = merge(
    this.calculatedPositiveEndPoint$,
    this._floorService.floor$
  );

  public setFinalEndPoint(roomProperties: GuideMapRoomProperties): void {
    this.getPathCoordinates(this.startPoint$.getValue()?.floor);
    this.currentUserEndpoint$.next(roomProperties);
    this.finalEndpoint$.next(roomProperties);
  }

  public setStartPoint(roomProperties: GuideMapRoomProperties): void {
    this.currentUserLocationPoint$.next(roomProperties);
    this.startPoint$.next(roomProperties);
  }

  public get pathPointsValues(): {
    currentUserLocationPoint: GuideMapRoomProperties;
    currentUserEndpoint: GuideMapRoomProperties;
  } {
    return {
      currentUserLocationPoint: this.currentUserLocationPoint$.value,
      currentUserEndpoint: this.currentUserEndpoint$.value,
    };
  }

  public get isHasUserLocationAndEndPoint(): boolean {
    return !!this.startPoint$.value && !!this.finalEndpoint$.value;
  }

  public calculateFullPath(): void {
    // TODO: refactor
    const startPoint = this.startPoint$.value.id;
    const finalEndpoint = this.finalEndpoint$.value.id;

    const path = this._mapGraphService.findPath(startPoint, finalEndpoint, []);

    this.fullPath$.next(path);
  }

  public getPathCoordinates(
    floor = this._floorService.floor
  ): ICoordinates[][] {
    const allPoints = this._mapDataProviderService.allPoints;
    const pathCoordinates = this._findFloorPath(
      floor,
      allPoints,
      this.startPoint$.value?.id,
      this.finalEndpoint$.value?.id
    );

    // console.log(pathCoordinates);

    return pathCoordinates;
  }

  private _findFloorPath(
    floor: number,
    allPoints: GuideMapFeaturePoint[],
    userLocationId: string,
    endPointId: string
  ): ICoordinates[][] {
    const path = this._mapGraphService.findPath(userLocationId, endPointId, []);

    // console.log(path);
    const pathCoordinates = this._fillDataOfPath(path, floor, allPoints);

    return pathCoordinates;
  }

  private _fillDataOfPath(
    path: GuideMapSimpleRoute[],
    floor: number,
    points: GuideMapFeaturePoint[]
  ): ICoordinates[][] {
    const uniqPathIds = MapPathUtils.getUniquePathIds(path);

    const fullPathWithCorridors = Array.from(uniqPathIds).map((pointId) => {
      const foundedCorridor = points.find(
        (item) => item.properties.id === pointId
      );

      return foundedCorridor;
    });

    const fullFloorPath = fullPathWithCorridors.filter(
      (point) => point.properties.floor === floor
    ) as GuideMapFeaturePoint<GuideMapRoomProperties>[];

    if (fullFloorPath.length > 1) {
      this.currentUserLocationPoint$.next(fullFloorPath[0].properties);
      this.currentUserEndpoint$.next(
        fullFloorPath[fullFloorPath.length - 1].properties
      );
    } else {
      this.currentUserLocationPoint$.next(null);
      this.currentUserEndpoint$.next(null);
    }

    const isShouldBeMoreThanOnePath =
      fullFloorPath.filter(
        (item) =>
          item.properties.category === GuideMapFeaturePointCategory.Stairs
      ).length > 1;

    const isTwoStairsOnFloorWithout = [
      fullFloorPath[0]?.properties.category,
      fullFloorPath[fullFloorPath.length]?.properties.category,
    ].every((item) => item !== GuideMapFeaturePointCategory.Stairs);

    if (isShouldBeMoreThanOnePath && isTwoStairsOnFloorWithout) {
      const paths: ICoordinates[][] = [];
      let pathIndex = 0;
      let stairsCounter = 0;

      fullFloorPath.forEach((item) => {
        if (item.properties.category === GuideMapFeaturePointCategory.Stairs) {
          stairsCounter++;
        }

        if (stairsCounter === 2) {
          pathIndex++;
          stairsCounter = 0;
        }

        paths[pathIndex] = [
          ...(isArray(paths[pathIndex]) ? paths[pathIndex] : []),
          { x: item.properties.x, y: item.properties.y },
        ];
      });

      return paths;
    }

    const corridors = fullFloorPath.filter(
      (item) =>
        item.properties.category === GuideMapFeaturePointCategory.Сorridor
    );

    return [corridors.map(({ properties: { x, y } }) => ({ x, y }))];
  }
}
