import { Component } from '@angular/core';
import { MapZoomService } from 'src/app/core/services/map-zoom.service';

@Component({
  selector: 'app-zoom-controls',
  templateUrl: './zoom-controls.component.html',
  styleUrls: ['./zoom-controls.component.scss'],
})
export class ZoomControlsComponent {
  constructor(private readonly _mapZoomService: MapZoomService) {}

  public readonly isMax$ = this._mapZoomService.isMaxZoom$;

  public readonly isMin$ = this._mapZoomService.isMinZoom$;

  public isNaturalScale$ = this._mapZoomService.isNaturalScale;

  public scale$ = this._mapZoomService.scale$;

  public zoomIn(): void {
    this._mapZoomService.zoomIn();
  }

  public zoomOut(): void {
    this._mapZoomService.zoomOut();
  }
}
