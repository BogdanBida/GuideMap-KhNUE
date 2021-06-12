import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { isNil } from 'lodash-es';
import { Observable, of, throwError } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';
import {
  DATA_NOT_FOUND,
  INVALI_DDATA,
  LINK_TO_ANOTHER_APP,
} from 'src/app/shared/constants';
import { environment as devEnvironment } from 'src/environments/environment';
import { environment as prodEnvironment } from 'src/environments/environment.prod';
import { queryParamsExtractor, RoutingUtils } from '../utils/routing.utils';
import { GmpQueryParamName } from './../enums/gmp-query-param-name.enum';
import { GmpQueryParams } from './../models/gmp-query-params';
import { MapGraphService } from './map-graph.service';
import { MapPathService } from './map-path.service';
import { MapService } from './map.service';

@UntilDestroy()
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
              ({ from, to }: GmpQueryParams) => !isNil(from) || !isNil(to)
            ),
            tap(({ from, to }) => {
              from && this._mapService.findAndSetLocationById(from);
              to && this._mapService.findAndSetEndpointById(to);
            }),
            take(1)
          );
        }),
        untilDestroyed(this)
      )
      .subscribe();

    const pointChanges$ = this._mapPathService.points$.pipe(
      filter((data) => data.some((value) => !isNil(value))),
      untilDestroyed(this)
    );

    pointChanges$.subscribe(([qrPoint, roomPoint]) => {
      const params = {} as GmpQueryParams;

      if (qrPoint) {
        params[GmpQueryParamName.From] = String(qrPoint.id);
      }

      if (roomPoint) {
        params[GmpQueryParamName.To] = String(roomPoint.id);
      }

      this._setQueryParams(params);
    });
  }

  public setPointsFromUrl$(url: string): Observable<void> {
    const isOurApp = new RegExp(
      `^${RoutingUtils.screenAddress(
        prodEnvironment.url
      )}|${RoutingUtils.screenAddress(devEnvironment.url)}`
    ).test(url);

    if (!isOurApp) {
      // eslint-disable-next-line no-console
      console.debug(`URL from qr code: ${url}`);

      return throwError(LINK_TO_ANOTHER_APP);
    }

    let extractedQueryParams = {} as GmpQueryParams;

    try {
      extractedQueryParams = queryParamsExtractor(url);
    } catch (error) {
      return throwError(error.message);
    }

    if (!Object.keys(extractedQueryParams).length) {
      return throwError(DATA_NOT_FOUND);
    }

    const { from, to } = extractedQueryParams;

    const newQueryParams = {} as GmpQueryParams;

    if (from && this._mapService.findAndSetLocationById(from)) {
      newQueryParams[GmpQueryParamName.From] = from;
    }

    if (to && this._mapService.findAndSetEndpointById(to)) {
      newQueryParams[GmpQueryParamName.To] = to;
    }

    if (!Object.keys(newQueryParams).length) {
      return throwError(INVALI_DDATA);
    }

    this._setQueryParams(newQueryParams);

    return of();
  }

  private _setQueryParams(queryParams: GmpQueryParams): void {
    this._router.navigate([], { queryParams });
  }
}
