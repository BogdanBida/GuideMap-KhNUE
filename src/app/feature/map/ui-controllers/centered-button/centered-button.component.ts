import { Component } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { isNil } from 'lodash-es';
import { PanZoomService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { MapPathService } from './../../../../core/services/map-path.service';

@UntilDestroy()
@Component({
  selector: 'app-centered-button',
  templateUrl: './centered-button.component.html',
  styleUrls: ['./centered-button.component.scss'],
})
export class CenteredButtonComponent {
  constructor(
    private readonly _panzoomService: PanZoomService,
    private readonly _mapMapPathService: MapPathService
  ) {}

  public readonly spriteIconsUrl = environment.spriteIconsPath;

  public centeredView(): void {
    const points = [
      this._mapMapPathService.startPoint$.value,
      this._mapMapPathService.finalEndpoint$.value,
    ];

    if (points.every(isNil)) {
      this._panzoomService.resetView();
    } else if (points.some(isNil)) {
      this._panzoomService.centerTo(points[0] || points[1]);
    } else {
      this._panzoomService.fitViewToBounds(points[0], points[1]);
    }
  }
}
