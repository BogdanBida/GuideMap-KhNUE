import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNil } from 'lodash';
import { Observable, of, throwError } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { queryParamsExtractor, screenAddress } from '../utils/routing.utils';
import { environment } from './../../../environments/environment.prod';
import { GmpQueryParams } from './../models/gmp-query-params';
import { MapDataProviderService } from './map-data-provider.service';
import { MapService } from './map.service';

@Injectable({
  providedIn: 'root',
})
export class GMPRouterService {
  constructor(
    private readonly _router: Router,
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _mapService: MapService,
    private readonly _mapDataProviderService: MapDataProviderService
  ) {}

  public init(): void {
    this._mapDataProviderService
      .init$()
      .pipe(
        switchMap(() => {
          return this._activatedRoute.queryParams.pipe(
            filter((params: GmpQueryParams) => !isNil(params.nodeid)),
            map((params: GmpQueryParams) => params.nodeid)
          );
        })
      )
      .subscribe((nodeid: string) => {
        const userLocation = this._mapDataProviderService.qrCodes.find(
          (node) => String(node.properties.id) === nodeid
        );
        this._mapService.setUserLocation(userLocation.properties);
      });
  }

  // * Need to discuss about this service and naming here
  public setQueryParamNodeid$(value: string): Observable<void> {
    try {
      const isOurApp = new RegExp(`^${screenAddress(environment.url)}`).test(
        value
      );

      if (!isOurApp) {
        return throwError('Not our app');
      }

      const nodeid = queryParamsExtractor(value, ['nodeid'])[0]?.value;

      if (!nodeid) {
        return throwError('Not found');
      }

      this._router.navigate([], { queryParams: { nodeid } });

      return of();
    } catch (error) {
      return throwError(error.message);
    }
  }
}
