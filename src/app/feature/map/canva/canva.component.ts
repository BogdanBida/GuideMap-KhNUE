import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MapService } from 'src/app/core/services/map.service';
import { DragNDrop } from 'src/app/core/utils';
import {
  FloorService,
  MapDataProviderService,
  MapDotService,
  MapGraphService,
  MapPathService,
} from './../../../core/services';
import { MapZoomService } from './../../../core/services/map-zoom.service';

const WIDTH = 3500;
const HEIGHT = 2550;
const DEFAULT_TRANSITION_SPEED = 500;
const WHEEL_ZOOM_STEP = 0.05;

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
    private readonly _renderer: Renderer2,
    private readonly _mapZoomService: MapZoomService,
    private readonly _mapService: MapService
  ) {}

  @ViewChild('target') public readonly elementRef: ElementRef<HTMLElement>;

  public dragNDrop = DragNDrop.onDrag(WIDTH, HEIGHT);

  public readonly scaleTransform$ = this._mapZoomService.scaleTransform$;

  public ngOnInit(): void {
    this._mapDataProviderService.init$().subscribe(() => {
      this._mapGraphService.createGraph();
    });
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
          this._moveMapTo(point?.x, point?.y);
        }
      });

    this._mapPathService.finalEndpoint$
      .pipe(untilDestroyed(this))
      .subscribe((point) => {
        this._mapService.clearPath();

        if (point) {
          this._moveMapTo(point.x, point.y);
        }
      });

    this._mapDotService.init();
    this._mapService.init();
  }

  public zoomIn(): void {
    this._mapZoomService.zoomIn(WHEEL_ZOOM_STEP);
  }

  public zoomOut(): void {
    this._mapZoomService.zoomOut(WHEEL_ZOOM_STEP);
  }

  public resetZoom(): void {
    this._mapZoomService.resetZoomFactor();
  }

  private _moveMapTo(
    left: number,
    top: number,
    transitionSpeed: number = DEFAULT_TRANSITION_SPEED
  ): void {
    if (left && top) {
      // adapt values ​​for zoom
      const zoomFactor = this._mapZoomService.zoomFactor;

      top = top * zoomFactor + (HEIGHT - HEIGHT * zoomFactor) / 2;
      left = left * zoomFactor + (WIDTH - WIDTH * zoomFactor) / 2;
      // centering
      let targetTop = top - window.innerHeight / 2;
      let targetLeft = left - window.innerWidth / 2;

      targetTop = targetTop < 0 ? 0 : targetTop;
      targetLeft = targetLeft < 0 ? 0 : targetLeft;

      this._renderer.setStyle(
        this.elementRef.nativeElement,
        'transition',
        `${transitionSpeed}ms`
      );
      this._renderer.setStyle(
        this.elementRef.nativeElement,
        'top',
        -targetTop + 'px'
      );
      this._renderer.setStyle(
        this.elementRef.nativeElement,
        'left',
        -targetLeft + 'px'
      );

      setTimeout(() => {
        this._renderer.setStyle(
          this.elementRef.nativeElement,
          'transition',
          'inherit'
        );
      }, transitionSpeed);
    }
  }
}
