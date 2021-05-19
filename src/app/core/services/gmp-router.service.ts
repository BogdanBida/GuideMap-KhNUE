import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNil } from 'lodash';
import { Observable, of, throwError } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import { queryParamsExtractor, screenAddress } from '../utils/routing.utils';
import { environment } from './../../../environments/environment.prod';
import { GmpQueryParams } from './../models/gmp-query-params';
import { GuideMapFeaturePointRoom } from './../models/guide-map-feature-point.interface';
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
            filter(
              (params: GmpQueryParams) =>
                !isNil(params.qrnodeid) || !isNil(params.roomid)
            )
          );
        })
      )
      .subscribe((params: GmpQueryParams) => {
        const { qrnodeid, roomid } = params;
        let userLocation: GuideMapFeaturePointRoom;
        let destination: GuideMapFeaturePointRoom;

        if (!isNil(qrnodeid)) {
          userLocation = this._mapDataProviderService.qrCodes.find(
            (node) => String(node.properties.id) === qrnodeid
          );
        }

        if (!isNil(roomid)) {
          destination = this._mapDataProviderService.rooms.find(
            (node) => String(node.properties.id) === roomid
          );
        }

        userLocation &&
          this._mapService.setUserLocation(userLocation.properties);
        destination &&
          this._mapService.setFinalEndpoint(destination.properties);
      });
  }

  public setQueryParamsFromUrl$(url: string): Observable<void> {
    try {
      const isOurApp = new RegExp(`^${screenAddress(environment.url)}`).test(
        url
      );

      if (!isOurApp) {
        return throwError('MESSAGES.LINK_TO_ANOTHER_APP');
      }

      const extractedQueryParams = queryParamsExtractor(url);

      if (!Object.keys(extractedQueryParams).length) {
        return throwError('MESSAGES.DATA_NOT_FOUND');
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
