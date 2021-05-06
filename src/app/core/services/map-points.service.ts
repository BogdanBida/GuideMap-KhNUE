import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GuideMapFeaturePointCategory } from '../enums';
import { JsonFile } from '../enums/json-files.enum';
import {
  GuideMapFeaturePoint,
  GuideMapFeaturePointCorridor,
  GuideMapFeaturePointRoom,
  Path,
} from '../models';
import { MapUtils } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class MapPointsService {
  constructor(private readonly _httpClient: HttpClient) {}

  public readonly rooms$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly qrCodes$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly corridors$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly qrCodesProperties$ = this.qrCodes$.pipe(
    map((qrCode) => qrCode.map(({ properties }) => properties))
  );

  public readonly qrCodesAndRooms$ = combineLatest([
    this.qrCodes$,
    this.rooms$,
  ]).pipe(
    map(([qrCodes, rooms]) => {
      return [...qrCodes, ...rooms];
    })
  );

  public readonly allPoints$ = combineLatest([
    this.qrCodes$,
    this.rooms$,
    this.corridors$,
  ]).pipe(
    map(([qrCodes, rooms, corridors]) => {
      return [...qrCodes, ...rooms, ...corridors];
    })
  );

  public get qrCodesAndRooms(): GuideMapFeaturePoint[] {
    return [...this.rooms$.getValue(), ...this.qrCodes$.getValue()];
  }

  public get corridors(): GuideMapFeaturePointCorridor[] {
    return this.corridors$.getValue() as GuideMapFeaturePointCorridor[];
  }

  public get rooms(): GuideMapFeaturePointRoom[] {
    return this.rooms$.getValue() as GuideMapFeaturePointRoom[];
  }

  public get qrCodes(): GuideMapFeaturePointRoom[] {
    return this.qrCodes$.getValue() as GuideMapFeaturePointRoom[];
  }

  public init$(): Observable<GuideMapFeaturePoint[]> {
    return this.getRoomsNodes().pipe(
      tap((points) => this._initFeaturePoints(points))
    );
  }

  public getRoomsNodes(): Observable<GuideMapFeaturePoint[]> {
    return this._getJsonDoc('mc', 1, JsonFile.Points);
  }

  private _getJsonDoc(
    corpsName: string,
    floor: number,
    type: string
  ): Observable<any> {
    return this._httpClient.get<Path[]>(
      `${environment.url}assets/json_data/${corpsName}${floor}/${type}.json`
    );
  }

  private _initFeaturePoints(points: GuideMapFeaturePoint[]): void {
    this.rooms$.next(
      MapUtils.filterByCategories(points, GuideMapFeaturePointCategory.room)
    );
    this.qrCodes$.next(
      MapUtils.filterByCategories(points, GuideMapFeaturePointCategory.qrCode)
    );
    this.corridors$.next(
      MapUtils.filterByCategories(points, GuideMapFeaturePointCategory.corridor)
    );
  }
}
