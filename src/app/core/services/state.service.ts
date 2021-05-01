import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import {
  floydWarshall,
  Graph,
  GraphEdge,
  GraphVertex,
} from 'src/app/shared/utils';
import { GuideMapFeaturePointCategory } from '../enums';
import {
  LocationNode,
  GuideMapCorridor,
  GuideMapSimpleRoute,
  GuideMapCorridorProperties,
} from '../models';
import { GuideMapFeaturePoint } from '../models/guide-map-feature-point.interface';
import { GuideMapRoomProperties } from '../models/guide-map-room-properties.interface';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  constructor(private readonly nodeService: NodeService) {}

  private roomsGraph: Graph = new Graph();

  private distances: number[][] = [];

  private nextVertices: GraphVertex[][] = [];

  public gotoClickEvent$ = new Observable();

  private _filterDataSet(
    dataSet: GuideMapFeaturePoint[],
    category: GuideMapFeaturePointCategory
  ): GuideMapFeaturePoint[] {
    return dataSet.filter(
      (featurePoint) => featurePoint.properties.category === category
    );
  }

  public createGraph(dataSet: GuideMapFeaturePoint[]) {
    this.roomsGraph = new Graph();
    const vertexes: GraphVertex[] = [];
    const edges: GraphEdge[] = [];
    const rooms = this._filterDataSet(
      dataSet,
      GuideMapFeaturePointCategory.room
    );

    const qrCode = this._filterDataSet(
      dataSet,
      GuideMapFeaturePointCategory.qrCode
    );
    
    const qrCodesAndRooms = [...rooms, ...qrCode]

    qrCodesAndRooms.forEach((room) => {
      const roomVertex = new GraphVertex(room.properties.id);
      vertexes.push(roomVertex);
      (room.properties as GuideMapRoomProperties).corridors.forEach(
        (corridor: GuideMapCorridor) => {
          const endRoomVertex =
            vertexes.find(
              (value: GraphVertex) => value.getKey() === corridor.endRoom
            ) || new GraphVertex(corridor.endRoom);

          const edge = new GraphEdge(
            roomVertex,
            endRoomVertex,
            corridor.corridorTracks.length
          );

          edges.push(edge);
        }
      );
    });

    vertexes.forEach((vertex: GraphVertex) => {
      this.roomsGraph.addVertex(vertex);
    });

    edges.forEach((edge: GraphEdge) => {
      this.roomsGraph.addEdge(edge);
    });

    const { distances, nextVertices } = floydWarshall(this.roomsGraph);

    this.distances = distances;
    this.nextVertices = nextVertices;
  }

  public getPathCoordinates$(): Observable<{ x: number; y: number }[]> {
    return this.nodeService.getRoomsNodes().pipe(
      withLatestFrom(this.nodeService.qrCodesAndRooms$),
      map(([points, qrCodesAndRooms]) => {
        const start = this.userLocation$.getValue().id;
        const end = this.endpoint$.getValue().id;

        const path = this.findPath(start, end, qrCodesAndRooms);
        const pathCoordinates = this.fillDataOfPath(
          path,
          points
        )[0].tracks.map(({ x, y }) => ({ x, y }));

        return pathCoordinates;
      })
    );
  }

  public fillDataOfPath(
    path: GuideMapSimpleRoute[],
    dataSet: GuideMapFeaturePoint[]
  ) {
    return path.map((routePart) => {
      return {
        ...routePart,
        tracks: routePart.tracks.map((trackId: number) =>
          this.findDataObjectById(
            dataSet,
            trackId,
            GuideMapFeaturePointCategory.corridor
          )
        ) as GuideMapCorridorProperties[],
      };
    });
  }

  public findDataObjectById(
    dataSet: GuideMapFeaturePoint[],
    id: number,
    category: GuideMapFeaturePointCategory
  ) {
    return dataSet.find(
      (value) =>
        value.properties.id === id && value.properties.category === category
    ).properties;
  }

  public findPath(
    from: number,
    to: number,
    dataSet: any[],
    resultList: any[] = [],
  ): {
    start: number;
    end: number;
    tracks: number[];
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

    const midStationId = nextVertex.getKey();

    const stationObject = dataSet.find(({ properties: { id } }) => id === from);

    const routeBetweenStartAndMidStation = (<GuideMapRoomProperties>(
      stationObject.properties
    )).corridors.find((route) => route.endRoom === midStationId);

    if (midStationId === to) {
      resultList.push({
        start: from,
        end: midStationId,
        tracks: routeBetweenStartAndMidStation?.corridorTracks || [],
      });

      return resultList;
    }

    if (routeBetweenStartAndMidStation) {
      resultList.push({
        start: from,
        end: midStationId,
        tracks: routeBetweenStartAndMidStation?.corridorTracks || [],
      });

      return this.findPath(midStationId, to, resultList);
    }

    return this.findPath(
      midStationId,
      to,
      this.findPath(from, midStationId, resultList)
    );
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

  private userLocation$ = new BehaviorSubject<GuideMapRoomProperties | null>(
    null
  );

  private endpoint$ = new BehaviorSubject<GuideMapRoomProperties | null>(null);
}
