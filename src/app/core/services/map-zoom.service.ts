import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const MAX_ZOOM = 1;
const MIN_ZOOM = 0.25;
const ZOOM_STEP = 0.25;
const DEFAULT_ZOOM_FACTOR = environment.defaultZoomFactor;
const ONE_HUNGRED = 100;

@Injectable({
  providedIn: 'root',
})
export class MapZoomService {
  public readonly zoomFactor$ = new BehaviorSubject<number>(
    DEFAULT_ZOOM_FACTOR
  );

  public readonly isMaxZoom$ = new BehaviorSubject<boolean>(
    DEFAULT_ZOOM_FACTOR === MAX_ZOOM
  );

  public readonly isMinZoom$ = new BehaviorSubject<boolean>(
    DEFAULT_ZOOM_FACTOR === MIN_ZOOM
  );

  public readonly isOneHungredPercentZoom$ = new BehaviorSubject<boolean>(
    DEFAULT_ZOOM_FACTOR * ONE_HUNGRED === ONE_HUNGRED
  );

  public readonly scale$ = this.zoomFactor$.pipe(
    map((value) => value * ONE_HUNGRED)
  );

  public readonly scaleTransform$ = this.zoomFactor$.pipe(
    map((value) => `scale(${value})`)
  );

  private get _zoomFactor(): number {
    return this.zoomFactor$.getValue();
  }

  private set _zoomFactor(value: number) {
    if (value > MAX_ZOOM || value < MIN_ZOOM) {
      return;
    }

    this.zoomFactor$.next(value);

    this.isMaxZoom$.next(value === MAX_ZOOM);
    this.isMinZoom$.next(value === MIN_ZOOM);
    this.isOneHungredPercentZoom$.next(value * ONE_HUNGRED === ONE_HUNGRED);
  }

  public zoomIn(): void {
    this._zoomFactor += this._zoomFactor < MAX_ZOOM ? ZOOM_STEP : 0;
  }

  public zoomOut(): void {
    this._zoomFactor -= this._zoomFactor > MIN_ZOOM ? ZOOM_STEP : 0;
  }
}
