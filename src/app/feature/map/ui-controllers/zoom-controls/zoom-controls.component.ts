import { Component } from '@angular/core';
import { PanZoomService } from './../../../../core/services/pan-zoom.service';

@Component({
  selector: 'app-zoom-controls',
  templateUrl: './zoom-controls.component.html',
  styleUrls: ['./zoom-controls.component.scss'],
})
export class ZoomControlsComponent {
  constructor(private readonly _panzoomService: PanZoomService) {}

  public readonly isMax$ = this._panzoomService.isMaxZoom$;

  public readonly isMin$ = this._panzoomService.isMinZoom$;

  public readonly isNaturalScale$ = this._panzoomService.isNaturalScale$;

  public readonly scale$ = this._panzoomService.zoomLevel$;

  public zoomIn(): void {
    this._panzoomService.zoomIn();
  }

  public zoomOut(): void {
    this._panzoomService.zoomOut();
  }
}
