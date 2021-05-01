import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  forkJoin,
  merge,
  Observable,
} from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import { GuideMapFeaturePointCategory } from '../enums';
import { NodeType } from '../enums/node-type.enum';
import {
  GuideMapFeaturePoint,
  LocationNode,
  Path,
  QRNode,
  RoomNode,
} from '../models';
import { RouteNode } from '../models/route-node';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private readonly _httpClient: HttpClient) {}

  public readonly rooms$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly qrCodes$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly qrCodesAndRooms$ = combineLatest([
    this.qrCodes$,
    this.rooms$,
  ]).pipe(
    map(([qrCodes, rooms]) => {
      return [...qrCodes, ...rooms];
    })
  );

  public init$(): Observable<GuideMapFeaturePoint[]> {
    return this.getRoomsNodes().pipe(
      tap((points) => {
        this.rooms$.next(
          this._filterDataSet(points, GuideMapFeaturePointCategory.room)
        );
        this.qrCodes$.next(
          this._filterDataSet(points, GuideMapFeaturePointCategory.qrCode)
        );
      })
    );
  }

  public readonly qrCodesProperties$ = this.qrCodes$.pipe(
    map((qrCode) => qrCode.map((item) => item.properties))
  );

  public getRoomsNodes(): Observable<GuideMapFeaturePoint[]> {
    return this.getJsonDoc('mc', 1, NodeType.RoomNode);
  }

  public getRooms(): Observable<GuideMapFeaturePoint[]> {
    return this.getJsonDoc('mc', 1, NodeType.RoomNode).pipe(
      map((rooms: GuideMapFeaturePoint[]) =>
        rooms.filter(
          (room) =>
            room.properties.category === GuideMapFeaturePointCategory.room
        )
      ),
      tap((rooms) => this.rooms$.next(rooms))
    );
  }

  public getQrCodes(): Observable<GuideMapFeaturePoint[]> {
    return this.getJsonDoc('mc', 1, NodeType.RoomNode).pipe(
      map((rooms: GuideMapFeaturePoint[]) =>
        rooms.filter(
          (room) =>
            room.properties.category === GuideMapFeaturePointCategory.qrCode
        )
      ),
      tap((qrCodes) => this.qrCodes$.next(qrCodes))
    );
  }

  public getQRNodes(): Observable<QRNode[]> {
    return this.getJsonDoc('mc', 1, NodeType.QrNode);
  }

  public getRouteNodes(): Observable<LocationNode[]> {
    return this.getJsonDoc('mc', 1, NodeType.RouteNode);
  }

  public getPaths(): Observable<Path[]> {
    return this.getJsonDoc('mc', 1, NodeType.PathNode);
  }

  public getCorridors(): Observable<RouteNode[]> {
    return this.getJsonDoc('mc', 1, NodeType.CoorridorsNode);
  }

  private getJsonDoc(
    corpsName: string,
    floor: number,
    type: string
  ): Observable<any> {
    return this._httpClient.get<Path[]>(
      `${environment.url}assets/json_data/${corpsName}${floor}/${type}.json`
    );
  }

  private _filterDataSet(
    dataSet: GuideMapFeaturePoint[],
    category: GuideMapFeaturePointCategory
  ): GuideMapFeaturePoint[] {
    return dataSet.filter(
      (featurePoint) => featurePoint.properties.category === category
    );
  }
}
