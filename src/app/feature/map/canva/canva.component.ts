import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { PanZoomConfig } from 'ngx-panzoom';
import { MapService } from 'src/app/core/services/map.service';
import {
  FloorService,
  MapDataProviderService,
  MapDotService,
  MapGraphService,
  MapPathService,
  PanZoomService,
} from './../../../core/services';

@UntilDestroy()
@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
})
export class CanvaComponent implements OnInit, AfterViewInit {
  constructor(
    private readonly _mapPathService: MapPathService,
    private readonly _mapGraphService: MapGraphService,
    private readonly _mapDotService: MapDotService,
    private readonly _mapDataProviderService: MapDataProviderService,
    private readonly _floorService: FloorService,
    private readonly _mapService: MapService,
    private readonly _panZoomService: PanZoomService
  ) {
    this.panzoomConfig = this._panZoomService.init();
  }

  public panzoomConfig: PanZoomConfig;

  public ngOnInit(): void {
    this._mapDataProviderService.init$().subscribe(() => {
      this._mapGraphService.createGraph();
    });

    this._panZoomService.init();
  }

  public ngAfterViewInit(): void {
    this._floorService.setFloorSubscribe(() => {
      // TODO: refactor
      this._mapService.clearPath();
      this._mapService.drawBackground();
    });

    this._mapPathService.startPoint$
      .pipe(untilDestroyed(this))
      .subscribe((point) => {
        this._mapService.clearPath();

        if (point) {
          this._panZoomService.centerTo(point);
        }
      });

    this._mapPathService.finalEndpoint$
      .pipe(untilDestroyed(this))
      .subscribe((point) => {
        this._mapService.clearPath();

        if (point) {
          this._panZoomService.centerTo(point);
        }
      });

    this._mapDotService.init();
    this._mapService.init();
  }
}
