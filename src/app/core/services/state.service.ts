/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
import {
  floydWarshall,
  Graph,
  GraphEdge,
  GraphVertex,
} from 'src/app/shared/utils';
import { GuideMapFeaturePointCategory } from '../enums';
import { GuideMapCorridorProperties, GuideMapSimpleRoute } from '../models';
import { GuideMapFeaturePoint } from '../models/guide-map-feature-point.interface';
import { GuideMapRoomProperties } from '../models/guide-map-room-properties.interface';
import { FloorService } from './floor.service';
import { MapPointsService } from './map-points.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(
    private readonly _guideMapPointsService: MapPointsService,
    private readonly _floorService: FloorService
  ) {}

  public gotoClickEvent$ = new Observable();

  private readonly roomsGraph: Graph = new Graph();

  // private distances: number[][] = [];

  private nextVertices: GraphVertex[][] = [];

  public drawPath() {
    this.userLocation = this.stairsEndPoint$.getValue();
    this.stairsEndPoint$.next(null);
  }

  private _getVertexes(points: GuideMapFeaturePoint[]): GraphVertex[] {
    const vertexes: GraphVertex[] = [];

    points.forEach((point) => {
      const corridorVertex = new GraphVertex(point.properties.id);

      vertexes.push(corridorVertex);
    });

    return vertexes;
  }

  public createGraph(): void {
    const qrCodesAndRooms = this._guideMapPointsService.qrCodesAndRooms;
    const corridors = this._guideMapPointsService.corridors$.getValue();
    const roomVertexes: GraphVertex[] = [...this._getVertexes(qrCodesAndRooms)];
    const corridorsVertexes = [...this._getVertexes(corridors)];
    const edges: GraphEdge[] = [];

    corridorsVertexes.forEach((corridor) => {
      const foundedCorridorItem = corridors.find(
        ({ properties }) => corridor.getKey() === properties.id
      )?.properties;

      (foundedCorridorItem as GuideMapCorridorProperties).corridors.forEach(
        (corridorId: number) => {
          const foundedRelatedCorridorVertex = corridorsVertexes.find(
            (corridor) => corridor.getKey() === corridorId
          );

          if (foundedRelatedCorridorVertex) {
            const edge = new GraphEdge(
              corridor,
              foundedRelatedCorridorVertex,
              1
            );

            edges.push(edge);
          }
        }
      );
    });

    roomVertexes.forEach((roomVertex) => {
      const foundedRoomItem = qrCodesAndRooms.find(
        ({ properties }) => roomVertex.getKey() === properties.id
      )?.properties;

      if (foundedRoomItem) {
        const foundedCorridorVertex = corridorsVertexes.find(
          (corridorsVertex) =>
            corridorsVertex.getKey() ===
            (foundedRoomItem as GuideMapRoomProperties).corridor
        );

        if (foundedCorridorVertex) {
          const edge = new GraphEdge(foundedCorridorVertex, roomVertex, 1);

          edges.push(edge);
        }
      }
    });

    [...roomVertexes, ...corridorsVertexes].forEach((vertex: GraphVertex) => {
      this.roomsGraph.addVertex(vertex);
    });

    edges.forEach((edge: GraphEdge) => {
      this.roomsGraph.addEdge(edge);
    });

    const { nextVertices } = floydWarshall(this.roomsGraph);

    // this.distances = distances;
    this.nextVertices = nextVertices;
  }

  public getPathCoordinates$(): Observable<{ x: number; y: number }[]> {
    return this._floorService.floor$.pipe(
      withLatestFrom(
        this.userLocation$,
        this._guideMapPointsService.allPoints$
      ),
      map(([floor, userLocation, points]) => {
        const start = userLocation.id;
        const end = this.endpoint$.getValue().id;

        const path = this.findPath(start, end, [], points);
        const pathCoordinates = this.fillDataOfPath(path, floor, points);

        return pathCoordinates;
      })
    );
  }

  public fillDataOfPath(
    path: GuideMapSimpleRoute[],
    floor: number,
    points: GuideMapFeaturePoint[]
  ) {
    const fullPath: number[] = path.map((item) => item.end);

    const fullPathWithCorridors = fullPath.map((pointId) => {
      const foundedCorridor = points.find(
        (item) => item.properties.id === pointId
      );

      return foundedCorridor;
    });

    const fullFuckingPath = [];

    for (let i = 0; i < fullPathWithCorridors.length; i++) {
      if (
        (fullPathWithCorridors[i].properties as GuideMapCorridorProperties)
          .floor !== floor
      ) {
        break;
      }

      fullFuckingPath.push(fullPathWithCorridors[i].properties as any);
    }
    const isStairsInPathFounded = fullFuckingPath.find(
      (item, index) => item.isStairs && index !== 0
    );

    if (isStairsInPathFounded) {
      this.stairsEndPoint$.next(isStairsInPathFounded);
    }

    const corridors = fullFuckingPath.filter(
      (item) => item.category === 'corridor' && !item.isStairs
    );

    return corridors.map(({ x, y }) => ({ x, y }));
  }

  public findDataObjectById(
    dataSet: GuideMapFeaturePoint[],
    id: number,
    category: GuideMapFeaturePointCategory
  ) {
    const foundedObject = dataSet.find((value) => {
      return (
        value.properties.id === id && value.properties.category === category
      );
    })?.properties;

    return foundedObject;
  }

  public findPath(
    from: number,
    to: number,
    resultList: any[] = [],
    dataSet: any[] = []
  ): {
    start: number;
    end: number;
    tracks: number;
  }[] {
    if (from === undefined || to === undefined) {
      return [];
    }

    const startVertex = this.roomsGraph.getVertexByKey(from);
    const endVertex = this.roomsGraph.getVertexByKey(to);
    const allGraphVertices = this.roomsGraph.getAllVertices();

    const startVertexIndex = allGraphVertices.indexOf(startVertex);
    const endVertexIndex = allGraphVertices.indexOf(endVertex);

    const nextVertex = this.nextVertices[endVertexIndex][startVertexIndex];

    if (!nextVertex) {
      return [];
    }

    const midNodeId = nextVertex.getKey();

    if (midNodeId === to) {
      resultList.push({
        start: from,
        end: midNodeId,
        tracks: [],
      });

      return resultList;
    }

    const foundedPathFromToMid = this.findPath(from, midNodeId, resultList);

    return this.findPath(midNodeId, to, foundedPathFromToMid, dataSet);
  }

  public set userLocation(value: GuideMapRoomProperties | null) {
    this.userLocation$.next(value);
  }

  public get userLocation(): GuideMapRoomProperties | null {
    return this.userLocation$.value;
  }

  public set endpoint(value: GuideMapRoomProperties | null) {
    this.endpoint$.next(value);
  }

  public get endpoint(): GuideMapRoomProperties | null {
    return this.endpoint$.value;
  }

  public get isHasUserLocationAndEndPoint(): boolean {
    return !!this.endpoint && !!this.userLocation;
  }

  public get searchParamsChanges$(): Observable<
    [GuideMapRoomProperties, GuideMapRoomProperties]
  > {
    return combineLatest([this.userLocation$, this.endpoint$]);
  }

  public getUserLocationBehaviorSubject(): BehaviorSubject<GuideMapRoomProperties | null> {
    return this.userLocation$;
  }

  public getEndpointBehaviorSubject(): BehaviorSubject<GuideMapRoomProperties | null> {
    return this.endpoint$;
  }

  private readonly userLocation$ = new BehaviorSubject<GuideMapRoomProperties | null>(
    null
  );

  private readonly endpoint$ = new BehaviorSubject<GuideMapRoomProperties | null>(
    null
  );

  public stairsEndPoint$ = new BehaviorSubject<GuideMapRoomProperties | null>(
    null
  );
}
