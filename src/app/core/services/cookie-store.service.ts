import { Injectable } from '@angular/core';
import { isNumber } from 'lodash-es';
import { CookieService } from 'ngx-cookie-service';

const PAN_POSITION_KEY = 'panpos';
const ZOOM_LEVEL_KEY = 'zoomlevel';

@Injectable({
  providedIn: 'root',
})
export class CookieStoreService {
  constructor(private readonly _cookieService: CookieService) {}

  public getPanZoomConfigs(): any {
    const panPos = this.getPanPosition();

    return {
      initialPanX: panPos?.x,
      initialPanY: panPos?.y,
      initialZoomLevel: this.getZoomLevel(),
    };
  }

  public savePanPosition({ x, y }: { x: number; y: number }): void {
    if (isNumber(x) && isNumber(y)) {
      this._cookieService.set(PAN_POSITION_KEY, JSON.stringify({ x, y }));
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
    return +this._cookieService.get(ZOOM_LEVEL_KEY) || null;
  }
}
