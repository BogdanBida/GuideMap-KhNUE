import { Injectable } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PanZoomAPI, PanZoomConfig, PanZoomModel } from 'ngx-panzoom';
import { ReplaySubject } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CookieStoreService } from './cookie-store.service';

const CENTERING_DURATION_S = 0.65;

const PANZOOM_CONFIG = {
  initialZoomLevel: 1,
  neutralZoomLevel: 2,
  zoomToFitZoomLevelFactor: 0.95,
  zoomLevels: 3,
  zoomStepDuration: 0.5,
  freeMouseWheelFactor: 0.0025,
};

@UntilDestroy()
@Injectable({
  providedIn: 'root',
})
export class PanZoomService {
  constructor(private readonly _cookieStoreService: CookieStoreService) {}

  public panZoomAPI: PanZoomAPI;

  public panzoomConfig: PanZoomConfig;

  public readonly model$ = new ReplaySubject<PanZoomModel>(1);

  public readonly api$ = new ReplaySubject<PanZoomAPI>(1);

  public zoomLevel$ = this.model$.pipe(
    map((model) => Math.round(+model.zoomLevel * 100) / 100)
  );

  public isNaturalScale$ = this.zoomLevel$.pipe(
    map((value) => value === PANZOOM_CONFIG.neutralZoomLevel)
  );

  public isMaxZoom$ = this.isNaturalScale$;

  public isMinZoom$ = this.zoomLevel$.pipe(map((value) => value === 0));

  public getModelPosition$ = this.model$.pipe(
    switchMap((model) => {
      return this.api$.pipe(
        map((api) => {
          return api.getModelPosition(model.pan);
        })
      );
    }),
    untilDestroyed(this)
  );

  public init(): PanZoomConfig {
    const storedPanzoomConfigs = this._cookieStoreService.getPanZoomConfigs();

    this.panzoomConfig = new PanZoomConfig(
      Object.assign({}, PANZOOM_CONFIG, storedPanzoomConfigs)
    );

    const api$ = this.panzoomConfig.api;

    this.panzoomConfig.modelChanged
      .pipe(untilDestroyed(this))
      .subscribe(this._onModelChanges.bind(this));

    api$.pipe(untilDestroyed(this)).subscribe((api: PanZoomAPI) => {
      this.api$.next(api);
    });

    return this.panzoomConfig;
  }

  public centerTo(x: number, y: number): void {
    this.api$.pipe(take(1)).subscribe((api) => {
      api.panToPoint({ x, y }, CENTERING_DURATION_S);
    });
  }

  public resetView(): void {
    const centerPoint = {
      x: environment.map.mapWidth / 2,
      y: environment.map.mapHeight / 2,
    };

    this.api$.pipe(take(1)).subscribe((api) => {
      api.panToPoint(centerPoint, CENTERING_DURATION_S / 2);
    });
  }

  public zoomIn(): void {
    this.api$.pipe(take(1)).subscribe((api) => {
      api.zoomIn();
    });
  }

  public zoomOut(): void {
    this.api$.pipe(take(1)).subscribe((api) => {
      api.zoomOut();
    });
  }

  private _onModelChanges(model: PanZoomModel): void {
    this.model$.next(model);
    this._cookieStoreService.savePanPosition(model.pan);
    this._cookieStoreService.saveZoomLevel(model.zoomLevel);
  }
}
