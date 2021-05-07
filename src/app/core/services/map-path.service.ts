import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { GuideMapFeaturePointCategory } from '../enums';
import { ICoordinates } from '../interfaces';
import {
  GuideMapFeaturePoint,
  GuideMapRoomProperties,
  GuideMapSimpleRoute,
} from '../models';
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

  public readonly fullPath$ = new BehaviorSubject<GuideMapSimpleRoute[]>([]);

  public readonly currentUserLocationPoint$ = new BehaviorSubject<GuideMapRoomProperties>(
    null
  );

  public readonly currentUserEndpoint$ = new BehaviorSubject<GuideMapRoomProperties>(
    null
  );

  public get pathCoordinatesChanges$(): Observable<
    [GuideMapRoomProperties, GuideMapRoomProperties]
  > {
    return combineLatest([
      this.currentUserLocationPoint$,
      this.currentUserEndpoint$,
    ]);
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
    const allPoints = this._mapDataProviderService.allPoints;
    const startPoint = this.startPoint$.value.id;
    const finalEndpoint = this.finalEndpoint$.value.id;

    const path = this._mapGraphService.findPath(
      startPoint,
      finalEndpoint,
      [],
      allPoints
    );

    this.fullPath$.next(path);
  }

  public getPathCoordinates(): ICoordinates[] {
    const floor = this._floorService.floor;
    const allPoints = this._mapDataProviderService.allPoints;
    const pathCoordinates = this._findFloorPath(
      floor,
      allPoints,
      this.startPoint$.value?.id,
      this.finalEndpoint$.value?.id
    );

    return pathCoordinates;
  }

  private _findFloorPath(
    floor: number,
    allPoints: GuideMapFeaturePoint[],
    userLocationId: number,
    endPointId: number
  ): ICoordinates[] {
    const path = this._mapGraphService.findPath(
      userLocationId,
      endPointId,
      [],
      allPoints
    );
    const pathCoordinates = this._fillDataOfPath(path, floor, allPoints);

    return pathCoordinates;
  }

  private _fillDataOfPath(
    path: GuideMapSimpleRoute[],
    floor: number,
    points: GuideMapFeaturePoint[]
  ): ICoordinates[] {
    const fullPath: Set<number> = path.reduce((acc, { start, end }) => {
      acc.add(start);
      acc.add(end);

      return acc;
    }, new Set<number>());

    const fullPathWithCorridors = Array.from(fullPath).map((pointId) => {
      const foundedCorridor = points.find(
        (item) => item.properties.id === pointId
      );

      return foundedCorridor;
    });

    const fullFloorPath = fullPathWithCorridors.filter(
      (point) => point.properties.floor === floor
    ) as GuideMapFeaturePoint<GuideMapRoomProperties>[];

    // const stairsInPathIndex = fullFloorPath.findIndex(
    //   (item) => item.properties.category === GuideMapFeaturePointCategory.stairs
    // );

    if (fullFloorPath.length > 1) {
      this.currentUserLocationPoint$.next(fullFloorPath[0].properties);
      this.currentUserEndpoint$.next(
        fullFloorPath[fullFloorPath.length - 1].properties
      );
    } else {
      this.currentUserLocationPoint$.next(null);
      this.currentUserEndpoint$.next(null);
    }

    // if (stairsInPathIndex > 0) {
    //   this.currentUserEndpoint$.next(
    //     fullFloorPath[stairsInPathIndex].properties
    //   );
    // }

    // if (stairsInPathIndex === 0) {
    //   this.currentUserLocationPoint$.next(
    //     fullFloorPath[stairsInPathIndex].properties
    //   );
    // }

    // if (stairsInPathIndex > 0) {
    //   this.stairsMiddlePoint$.next(fullFloorPath[stairsInPathIndex].properties);
    // }

    const corridors = fullFloorPath.filter(
      (item) =>
        item.properties.category === GuideMapFeaturePointCategory.Сorridor
    );

    return corridors.map(({ properties: { x, y } }) => ({ x, y }));
  }
}
