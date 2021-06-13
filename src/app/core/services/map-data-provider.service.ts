import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { GuideMapFeaturePointCategory } from '../enums';
import { JsonFile } from '../enums/json-files.enum';
import {
  GuideMapFeaturePoint,
  GuideMapFeaturePointCorridor,
  GuideMapFeaturePointRoom,
} from '../models';
import { MapUtils } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class MapDataProviderService {
  constructor(private readonly _httpClient: HttpClient) {}

  public readonly rooms$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly qrCodes$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly corridors$ = new BehaviorSubject<GuideMapFeaturePoint[]>([]);

  public readonly qrCodesProperties$ = this.qrCodes$.pipe(
    map((qrCode) => qrCode.map(({ properties }) => properties))
  );

  public get allPoints(): GuideMapFeaturePoint[] {
    return [
      ...this.rooms$.getValue(),
      ...this.qrCodes$.getValue(),
      ...this.corridors$.getValue(),
    ];
  }

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
    return this.getFeaturePoints().pipe(
      tap((points) => this._initFeaturePoints(points))
    );
  }

  public getFeaturePoints(): Observable<GuideMapFeaturePoint[]> {
    return this._getJsonDoc(JsonFile.Points);
  }

  private _getJsonDoc(type: JsonFile): Observable<GuideMapFeaturePoint[]> {
    return this._httpClient.get<GuideMapFeaturePoint[]>(
      `${environment.url}/assets/json_data/${type}.json`
    );
  }

  private _initFeaturePoints(points: GuideMapFeaturePoint[]): void {
    this.rooms$.next(
      MapUtils.filterByCategories(points, GuideMapFeaturePointCategory.Room)
    );
    this.qrCodes$.next(
      MapUtils.filterByCategories(points, GuideMapFeaturePointCategory.QrCode)
    );
    this.corridors$.next(
      MapUtils.filterByCategories(
        points,
        ...[
          GuideMapFeaturePointCategory.Сorridor,
          GuideMapFeaturePointCategory.Stairs,
        ]
      )
    );
  }
}
