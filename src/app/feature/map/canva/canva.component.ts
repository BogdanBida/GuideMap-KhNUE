/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { withLatestFrom } from 'rxjs/operators';
import { MapService } from 'src/app/core/services/map.service';
import { DragNDrop } from '../../../../utils/dragndrop';
import { GuideMapRoomProperties } from './../../../core/models';
import {
  FloorService,
  MapDataProviderService,
  MapDotService,
  MapGraphService,
  MapPathService,
} from './../../../core/services';

const WIDTH = 3500;
const HEIGHT = 2550;
const DEFAULT_TRANSITION_SPEED = 500;
const DEFAULT_ZOOM_FACTOR = 1;

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
    private readonly renderer: Renderer2,
    private readonly _mapService: MapService
  ) {}

  @ViewChild('target') public readonly elementRef: ElementRef<HTMLElement>;

  @Input() public zoomFactor = DEFAULT_ZOOM_FACTOR;

  public dragNDrop = DragNDrop.onDrag(WIDTH, HEIGHT);

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

    this._mapPathService.currentUserLocationPoint$
      .pipe(
        withLatestFrom(this._mapPathService.currentUserEndpoint$),
        untilDestroyed(this)
      )
      .subscribe(([userLocation, endpoint]) => {
        // TODO: refactor
        this._mapService.clearPath();
        // this._mapDotService.drawUserLocation(userLocation);

        if (endpoint) {
          this.moveMapTo(endpoint?.x, endpoint?.y);
        } else {
          this.moveMapTo(userLocation?.x, userLocation?.y);
        }
      });

    this._mapDotService.init();
    this._mapService.init();
    // this._mapPathService.pathCoordinatesChanges$
    //   .pipe(withLatestFrom(this._mapPathService.userLocation$))
    //   .subscribe(([, userLocation]) => {
    //     this._drawAndMove(userLocation);
    //   });
  }

  public _drawAndMove(userLocation: GuideMapRoomProperties): void {
    if (this._mapPathService.isHasUserLocationAndEndPoint) {
      // this._mapService.drawPath();
      this.moveMapTo(userLocation.x, userLocation.y);
    }
  }

  private moveMapTo(
    left: number,
    top: number,
    transitionSpeed: number = DEFAULT_TRANSITION_SPEED
  ): void {
    if (left && top) {
      // adapt values ​​for zoom
      top = top * this.zoomFactor + (HEIGHT - HEIGHT * this.zoomFactor) / 2;
      left = left * this.zoomFactor + (WIDTH - WIDTH * this.zoomFactor) / 2;
      // centering
      let targetTop = top - window.innerHeight / 2;
      let targetLeft = left - window.innerWidth / 2;

      targetTop = targetTop < 0 ? 0 : targetTop;
      targetLeft = targetLeft < 0 ? 0 : targetLeft;

      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'transition',
        `${transitionSpeed}ms`
      );
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'top',
        -targetTop + 'px'
      );
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'left',
        -targetLeft + 'px'
      );

      setTimeout(() => {
        this.renderer.setStyle(
          this.elementRef.nativeElement,
          'transition',
          'inherit'
        );
      }, transitionSpeed);
    }
  }
}
