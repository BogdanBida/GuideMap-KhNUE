import { Injectable } from '@angular/core';
import { isFinite } from 'lodash-es';
import { CookieService } from 'ngx-cookie-service';
import { PanZoomConfigOptions } from 'ngx-panzoom';
import { ICoordinates } from '../interfaces';

const PAN_POSITION_KEY = 'panpos';
const ZOOM_LEVEL_KEY = 'zoomlevel';

@Injectable({
  providedIn: 'root',
})
export class CookieStoreService {
  constructor(private readonly _cookieService: CookieService) {}

  public getPanZoomConfigs(): PanZoomConfigOptions {
    const config = {} as PanZoomConfigOptions;

    const panPos = this.getPanPosition();
    const zoomLevel = this.getZoomLevel();

    if (panPos) {
      config.initialPanX = panPos.x;
      config.initialPanY = panPos.y;
    }

    if (isFinite(zoomLevel)) {
      config.initialZoomLevel = zoomLevel;
    }

    return config;
  }

  public savePanPosition(point: ICoordinates): void {
    if (Object.values(point).every((item) => isFinite(item))) {
      this._cookieService.set(PAN_POSITION_KEY, JSON.stringify(point));
    }
  }

  public getPanPosition(): { x: number; y: number } | null {
    const rawData = this._cookieService.get(PAN_POSITION_KEY);

    return rawData ? JSON.parse(rawData) : null;
  }

  public saveZoomLevel(level: number): void {
    this._cookieService.set(ZOOM_LEVEL_KEY, String(level));
  }

  public getZoomLevel(): number | null {
    return Number(this._cookieService.get(ZOOM_LEVEL_KEY));
  }
}
