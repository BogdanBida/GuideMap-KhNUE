/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { GuideMapFeaturePointCategory } from '../enums';
import { NodeType } from '../enums/node-type.enum';
import { GuideMapFeaturePoint, LocationNode, Path, QRNode } from '../models';
import { RouteNode } from '../models/route-node';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private readonly _httpClient: HttpClient) {}

  public readonly rooms$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly qrCodes$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly corridors$ = new BehaviorSubject<any[]>([]);

  public readonly qrCodesProperties$ = this.qrCodes$.pipe(
    map((qrCode) => qrCode.map((item) => item.properties))
  );

  public readonly qrCodesAndRooms$ = combineLatest([
    this.qrCodes$,
    this.rooms$,
  ]).pipe(
    map(([qrCodes, rooms]) => {
      return [...qrCodes, ...rooms];
    })
  );

  public readonly allNodes$ = combineLatest([
    this.qrCodes$,
    this.rooms$,
    this.corridors$,
  ]).pipe(
    map(([qrCodes, rooms, corridors]) => {
      return [...qrCodes, ...rooms, ...corridors];
    })
  );

  public get allNodes(): GuideMapFeaturePoint[] {
    return [
      ...this.rooms$.getValue(),
      ...this.qrCodes$.getValue(),
      ...this.corridors$.getValue(),
    ];
  }

  public get qrCodesAndRooms(): GuideMapFeaturePoint[] {
    return [...this.rooms$.getValue(), ...this.qrCodes$.getValue()];
  }

  public init$(): Observable<GuideMapFeaturePoint[]> {
    return this.getRoomsNodes().pipe(
      tap((points) => {
        this.rooms$.next(
          this._filterDataSet(points, GuideMapFeaturePointCategory.room)
        );
        this.qrCodes$.next(
          this._filterDataSet(points, GuideMapFeaturePointCategory.qrCode)
        );
        this.corridors$.next(
          this._filterDataSet(points, GuideMapFeaturePointCategory.corridor)
        );
      })
    );
  }

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
