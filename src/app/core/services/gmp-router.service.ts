import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNil } from 'lodash';
import { combineLatest, Observable, of, throwError } from 'rxjs';
import { filter, switchMap, take } from 'rxjs/operators';
import { queryParamsExtractor, screenAddress } from '../utils/routing.utils';
import { environment } from './../../../environments/environment.prod';
import { GmpQueryParamName } from './../enums/gmp-query-param-name.enum';
import { RoutingTranslates } from './../enums/translate-routing.enum';
import { GmpQueryParams } from './../models/gmp-query-params';
import { MapGraphService } from './map-graph.service';
import { MapPathService } from './map-path.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class GMPRouterService {
  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _mapService: MapService,
    private readonly _mapPathService: MapPathService,
    private readonly _mapGraphService: MapGraphService
  ) {}

  public init(): void {
    this._mapGraphService.dataLoaded$
      .pipe(
        switchMap(() => {
          return this._activatedRoute.queryParams.pipe(
            filter(
              (params: GmpQueryParams) =>
                !isNil(params.qrnodeid) || !isNil(params.roomid)
            ),
            take(1)
          );
        })
      )
      .subscribe((params: GmpQueryParams) => {
        const { qrnodeid, roomid } = params;

        qrnodeid && this._mapService.findAndSetLocationById(qrnodeid);
        roomid && this._mapService.findAndSetEndpointById(roomid);
      });

    const pointChanges$ = combineLatest([
      this._mapPathService.startPoint$,
      this._mapPathService.finalEndpoint$,
    ]).pipe(filter((data) => data.some((value) => !isNil(value))));

    pointChanges$.subscribe(([qrPoint, roomPoint]) => {
      const params = {} as GmpQueryParams;

      if (qrPoint) {
        params[GmpQueryParamName.QrNodeId] = String(qrPoint.id);
      }

      if (roomPoint) {
        params[GmpQueryParamName.RoomId] = String(roomPoint.id);
      }

      this._setQueryParams(params);
    });
  }

  public setQueryParamsFromUrl$(url: string): Observable<void> {
    try {
      const isOurApp = new RegExp(`^${screenAddress(environment.url)}`).test(
        url
      );

      if (!isOurApp) {
        return throwError(RoutingTranslates.LinkToAnotherApp);
      }

      const extractedQueryParams = queryParamsExtractor(url);

      if (!Object.keys(extractedQueryParams).length) {
        return throwError(RoutingTranslates.DataNotFound);
      }

      this._setQueryParams(extractedQueryParams);

      return of();
    } catch (error) {
      return throwError(error.message);
    }
  }

  private _setQueryParams(queryParams: GmpQueryParams): void {
    this._router.navigate([], { queryParams });
  }
}
