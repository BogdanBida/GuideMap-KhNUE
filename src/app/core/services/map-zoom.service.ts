import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

const MAX_ZOOM = 1;
const MIN_ZOOM = 0.25;
const DEFAULT_ZOOM_STEP = 0.25;
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
    map((value) => Math.round(value * ONE_HUNGRED))
  );

  public readonly scaleTransform$ = this.zoomFactor$.pipe(
    map((value) => `scale(${value})`)
  );

  public zoomIn(step: number = DEFAULT_ZOOM_STEP): void {
    const value = this._zoomFactor;
    const newValue = value + step;

    this._zoomFactor = newValue < MAX_ZOOM ? newValue : MAX_ZOOM;
  }

  public zoomOut(step: number = DEFAULT_ZOOM_STEP): void {
    const value = this._zoomFactor;
    const newValue = value - step;

    this._zoomFactor = newValue > MIN_ZOOM ? newValue : MIN_ZOOM;
  }

  public resetZoomFactor(): void {
    this._zoomFactor = DEFAULT_ZOOM_FACTOR;
  }

  private get _zoomFactor(): number {
    return this.zoomFactor$.getValue();
  }

  private set _zoomFactor(rawValue: number) {
    const value = Math.round(rawValue * ONE_HUNGRED) / ONE_HUNGRED;

    if (value > MAX_ZOOM || value < MIN_ZOOM) {
      return;
    }

    this.zoomFactor$.next(value);

    this.isMaxZoom$.next(value === MAX_ZOOM);
    this.isMinZoom$.next(value === MIN_ZOOM);
    this.isOneHungredPercentZoom$.next(value * ONE_HUNGRED === ONE_HUNGRED);
  }
}
