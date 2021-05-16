import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  DEFAULT_ZOOM_FACTOR,
  DEFAULT_ZOOM_STEP,
  MAX_ZOOM,
  MIN_ZOOM,
} from 'src/app/shared/constants';
import { convertNumberToPercent } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class MapZoomService {
  public readonly zoomFactor$ = new BehaviorSubject<number>(
    DEFAULT_ZOOM_FACTOR
  );

  public readonly isMaxZoom$ = this.zoomFactor$.pipe(
    map((value) => value === MAX_ZOOM)
  );

  public readonly isMinZoom$ = this.zoomFactor$.pipe(
    map((value) => value === MIN_ZOOM)
  );

  public readonly isNaturalScale = this.zoomFactor$.pipe(
    map((value) => value === 1)
  );

  public readonly scale$ = this.zoomFactor$.pipe(map(convertNumberToPercent));

  public readonly scaleTransform$ = this.zoomFactor$.pipe(
    map((value) => `scale(${value})`)
  );

  public zoomIn(step: number = DEFAULT_ZOOM_STEP): void {
    const newValue = this.zoomFactor + step;

    this.zoomFactor = newValue < MAX_ZOOM ? newValue : MAX_ZOOM;
  }

  public zoomOut(step: number = DEFAULT_ZOOM_STEP): void {
    const newValue = this.zoomFactor - step;

    this.zoomFactor = newValue > MIN_ZOOM ? newValue : MIN_ZOOM;
  }

  public resetZoomFactor(): void {
    this.zoomFactor = DEFAULT_ZOOM_FACTOR;
  }

  public get zoomFactor(): number {
    return this.zoomFactor$.getValue();
  }

  public set zoomFactor(value: number) {
    const isValidValue = value <= MAX_ZOOM && value >= MIN_ZOOM;

    isValidValue && this.zoomFactor$.next(value);
  }
}
