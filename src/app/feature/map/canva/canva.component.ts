import { SvgPathUtils } from './../../../../utils/svg-path.utils';
import {
  Path,
  LocationNode,
  GuideMapRoomProperties,
} from './../../../core/models';
import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  AfterViewInit,
  Renderer2,
  ViewChild,
  Input,
  HostListener,
} from '@angular/core';
import { Circle, Svg, SVG, Path as SvgPath } from '@svgdotjs/svg.js';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { DragNDrop } from '../../../../utils/dragndrop';
import {
  FloorService,
  NodeService,
  StateService,
} from './../../../core/services';

import { USER_LOC_COLOR, ENDPOINT_COLOR, STROKE_CONFIG, STAIRS_ENDPOINT_COLOR } from './canvas-config';

const WIDTH = 3500;
const HEIGHT = 2550;
const DEFAULT_TRANSITION_SPEED = 500;
const DEFAULT_ZOOM_FACTOR = 1;

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
})
export class CanvaComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('target') elementRef: ElementRef;

  @Input() zoomFactor = DEFAULT_ZOOM_FACTOR;

  public currentFloor: number;

  public dragNDrop = DragNDrop.onDrag(WIDTH, HEIGHT);
  // ---------------- svg entities
  private canvas: Svg;
  private backgroundCanvas: Svg;
  private userDot: Circle;
  private endpointDot: Circle;
  private currentPath: SvgPath;
  // ----------------
  private routes: LocationNode[];
  // private path: Path;
  // ---------------- rxjs entities
  private subscriptions$: Subscription[] = [];
  private locationsSubject$: Subject<void> = new Subject();
  private nodesSubject$: Subject<void> = new Subject();

  @HostListener('wheel', ['$event'])
  public onWheel(event: MouseEvent): void {
    if (event.ctrlKey === true) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  private coordinates = [];

  constructor(
    private stateService: StateService,
    private nodeService: NodeService,
    private floorService: FloorService,
    private renderer: Renderer2
  ) {}

  public onClick(event): void {
    this.coordinates.push({ x: event.layerX, y: event.layerY });
    console.log(this.coordinates);
  }

  ngOnInit(): void {
    const [width, height] = [WIDTH + 'px', HEIGHT + 'px'];
    this.canvas = SVG().addTo('#canv').size(width, height);
    this.backgroundCanvas = SVG().addTo('#bgr-canv').size(width, height);
    this.drawBackground(this.getFloorImageName(this.currentFloor));

    // combineLatest([
    //   this.nodeService.getRouteNodes(),
    //   // this.nodeService.getPaths(),
    //   this.nodeService.getRoomsNodes(),
    //   this.nodeService.getRooms(),
    // ])
    this.nodeService.init$().subscribe(() => {
      this.stateService.createGraph();
      // this.routes = nodes;
      // this.path = paths[0];
    });

    this.subscriptions$.push(
      this.floorService.setFloorSubscribe((floor) => {
        this.currentFloor = floor;
        // this.stateService.endpoint = null;
        this.clearPath();
        this.drawBackground();
      })
    );

    combineLatest([
      this.stateService.getUserLocationBehaviorSubject(),
      this.stateService.getEndpointBehaviorSubject(),
    ])
      .pipe(takeUntil(this.locationsSubject$))
      .subscribe(([userLocation, endpoint]) => {
        this.clearPath();
        this.drawUserLocation(userLocation);
        userLocation && this.moveMapTo(userLocation.x, userLocation.y);
        endpoint && this.moveMapTo(endpoint.x, endpoint.y);
      });

    combineLatest([
      this.stateService.stairsEndPoint$,
      this.stateService.getEndpointBehaviorSubject(),
    ])
      .subscribe(([stairsEndPoint, endpoint]) => {
        if(stairsEndPoint) {
          this.endpointDot = this.drawPoint(
            this.endpointDot,
            stairsEndPoint,
            STAIRS_ENDPOINT_COLOR
          );
        } else {
          this.endpointDot = this.drawPoint(
            this.endpointDot,
            endpoint,
            ENDPOINT_COLOR
          );
        }
      });
  }

  ngAfterViewInit(): void {
    // * drawing path if goto btn is clicked
    this.subscriptions$.push(
      this.stateService.searchParamsChanges$.subscribe(() => {
        this._drawAndMove();
      })
    );
  }

  public _drawAndMove(): void {
    if (this.stateService.isHasUserLocationAndEndPoint) {
      this.drawPath();
      this.moveMapTo(
        this.stateService.userLocation.x,
        this.stateService.userLocation.y
      );
    }
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((s) => s.unsubscribe());
    const subjects = [this.locationsSubject$, this.nodesSubject$];
    subjects.forEach((s) => {
      s.next();
      s.complete();
    });
  }

  private moveMapTo(
    left: number,
    top: number,
    transitionSpeed: number = DEFAULT_TRANSITION_SPEED
  ): void {
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

  private drawUserLocation(location: LocationNode): void {
    this.userDot = this.drawPoint(this.userDot, location, USER_LOC_COLOR);
  }
  private drawEndpointLocation(location: LocationNode): void {
    this.endpointDot = this.drawPoint(
      this.endpointDot,
      location,
      ENDPOINT_COLOR
    );
  }
  private drawPoint(
    Dot: Circle,
    location: LocationNode,
    color: string = '#505050'
  ): Circle {
    Dot && Dot.remove();

    if (this.canvas && location) {
      const radius = 25;
      const maxRadius = 500;
      const { x, y } = location;
      Dot = this.canvas
        .circle(maxRadius)
        .attr({ fill: color, opacity: 0 })
        .move(x - maxRadius / 2, y - maxRadius / 2);
      Dot.animate({ duration: 2500 })
        .size(radius, radius)
        .attr({ fill: color, opacity: 0.75 });
      Dot.animate({ ease: '<' });
      Dot.animate({ duration: 1000, ease: '<>' })
        .loop(Infinity, true)
        .size(radius + 20, radius + 20)
        .attr({ opacity: 0.4 });
    }
    return Dot;
  }

  private clearPath(): void {
    this.currentPath && this.currentPath.remove();
  }

  private drawPath(): void {
    this.stateService
      .getPathCoordinates$()
      .pipe(
        tap((coordinates) => {
          debugger
          this.clearPath();
          const { userLocation, endpoint } = this.stateService;
          const stairsEndPoint = this.stateService.stairsEndPoint$.getValue();

          const currentEndPoint = stairsEndPoint ?? endpoint;

          const properties = userLocation;
          // todo: change to find path data by user and endpoint
          // const path = this.path[properties.id + '-' + endpoint.id];

          const points: number[][] = [
            [properties.x, properties.y],
            ...coordinates.map(({ x, y }) => [x, y]),
            // ...path.map(v => {
            //   const { x, y } = this.routes[v];
            //   return [x, y];
            // }),
            [currentEndPoint.x, currentEndPoint.y],
          ];

          const pathString = points.reduce((acc, point, i, a) => {
            return i === 0
              ? `M ${point[0]},${point[1]}`
              : `${acc} ${SvgPathUtils.bezierCommand(point, i, a)}`;
          }, '');

          this.currentPath = this.canvas
            .path(pathString)
            .stroke(STROKE_CONFIG)
            .fill({
              color: '#00000000',
            })
            .attr({
              'stroke-dashoffset': '0',
            });
          this.currentPath
            .animate({ duration: 4000, ease: '>' })
            .loop(1, false)
            .attr({
              'stroke-dashoffset': '-70',
            });
        })
      )
      .subscribe();
  }

  private drawBackground(
    imgname = this.getFloorImageName(this.currentFloor)
  ): void {
    if (this.backgroundCanvas && imgname) {
      this.backgroundCanvas.clear();
      this.backgroundCanvas
        .image('assets/floor-plans/' + imgname)
        .size('100%', '100%');
    }
  }

  private getFloorImageName(floor: number): string {
    return floor ? floor + '.svg' : null;
  }
}
