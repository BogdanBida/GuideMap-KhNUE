import { Path, LocationNode } from './../../../core/models';
import { Component, ElementRef, OnDestroy, OnInit, AfterViewInit, Renderer2, ViewChild } from '@angular/core';
import { Circle, Line, Svg, SVG } from '@svgdotjs/svg.js';
import { combineLatest, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DragNDrop } from '../../../../utils/dragndrop';
import { FloorService, NodeService, StateService } from './../../../core/services';

import { USER_LOC_COLOR, ENDPOINT_COLOR, STROKE_CONFIG } from './canvas-config';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
})
export class CanvaComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('target') elementRef: ElementRef;

  public currentFloor: number;
  public dragNDrop = DragNDrop.onDrag; // * composition for expanding functionality (add drag n drop to map)
  // ---------------- Drawing context
  private canvas: Svg;
  private backgroundCanvas: Svg;
  // ---------------- svg entities
  private userDot: Circle;
  private endpointDot: Circle;
  private currentPath: Line[] = [];
  // ----------------
  private routes: LocationNode[];
  private path: Path;
  // ---------------- rxjs entities
  private subscriptions$: Subscription[] = [];
  private locationsSubject$: Subject<void> = new Subject();
  private nodesSubject$: Subject<void> = new Subject();

  constructor(
    private stateService: StateService,
    private nodeService: NodeService,
    private floorService: FloorService,
    private renderer: Renderer2,
  ) { }
  // --------------------- lifecycle methods -----------------------------------
  ngOnInit(): void {
    const [width, height] = ['3500px', '2550px'];
    this.canvas = SVG().addTo('#canv').size(width, height);
    this.backgroundCanvas = SVG().addTo('#bgr-canv').size(width, height);
    this.drawBackground(this.getFloorImageName(this.currentFloor));

    combineLatest([
      this.nodeService.getRouteNodes(),
      this.nodeService.getPaths(),
    ]).pipe(
      takeUntil(this.nodesSubject$)
    ).subscribe(([nodes, paths]) => {
      this.routes = nodes;
      this.path = paths[0];
    });

    this.subscriptions$.push(this.floorService.setFloorSubscribe((floor) => {
      this.currentFloor = floor;
      this.drawBackground();
    }));

    combineLatest([
      this.stateService.getUserLocationBehaviorSubject(),
      this.stateService.getEndpointBehaviorSubject()
    ]).pipe(
      takeUntil(this.locationsSubject$)
    ).subscribe(([userLocation, endpoint]) => {
      this.clearPath();
      if (userLocation) {
        this.drawUserLocation(userLocation);
        this.moveMapTo(userLocation.x, userLocation.y);
      }
      if (endpoint) {
        this.drawEndpointLocation(endpoint);
        this.moveMapTo(endpoint.x, endpoint.y);
      }
    });
  }

  ngAfterViewInit(): void { // * drawing path if goto btn is clicked
    this.subscriptions$.push(this.stateService.gotoClickEvent.subscribe(() => {
      if (this.stateService.userLocation && this.stateService.endpoint) {
        this.drawPath();
      }
    }));
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(s => s.unsubscribe());
    const subjects = [this.locationsSubject$, this.nodesSubject$];
    subjects.forEach(s => { s.next(); s.complete(); });
  }

  // ---------------------------------- other functions -------------------------------
  private moveMapTo(left: number, top: number, transitionSpeed: number = 500): void {
    let targetTop = top - window.innerHeight / 2;
    let targetLeft = left - window.innerWidth / 2;

    targetTop = targetTop < 0 ? 0 : targetTop;
    targetLeft = targetLeft < 0 ? 0 : targetLeft;
    this.renderer.setStyle(this.elementRef.nativeElement, 'transition', `${transitionSpeed}ms`);
    this.renderer.setStyle(this.elementRef.nativeElement, 'top', - targetTop + 'px');
    this.renderer.setStyle(this.elementRef.nativeElement, 'left', - targetLeft + 'px');

    setTimeout(() => {
      this.renderer.setStyle(this.elementRef.nativeElement, 'transition', 'inherit');
    }, transitionSpeed);
  }

  private drawUserLocation(location: LocationNode): void {
    this.userDot = this.drawPoint(this.userDot, location, USER_LOC_COLOR);
  }
  private drawEndpointLocation(location: LocationNode): void {
    this.endpointDot = this.drawPoint(this.endpointDot, location, ENDPOINT_COLOR);
  }
  private drawPoint(Dot: Circle, location: LocationNode, color: string = '#505050'): Circle {
    Dot && Dot.remove();

    if (this.canvas && location) {
      const radius = 25;
      const maxRadius = 2500;
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
    this.currentPath.forEach((p) => p.remove());
    this.currentPath = [];
  }

  private drawPath(): void {
    this.clearPath();
    const { userLocation, endpoint } = this.stateService;
    // todo: change to find path data by user and endpoint
    const path = this.path[userLocation.id + '-' + endpoint.id];

    const dots: { x: number, y: number }[] = [
      { x: userLocation.x, y: userLocation.y },
      ...path.map(v => (this.routes[v])),
      { x: endpoint.x, y: endpoint.y },
    ];

    for (let i = 0; i < dots.length - 1; i++) {
      const line = this.canvas
        .line(dots[i].x, dots[i].y, dots[i + 1].x, dots[i + 1].y)
        .stroke(STROKE_CONFIG)
        .attr({
          'stroke-dashoffset': '0'
        });
      line
        .animate({ duration: 700, ease: '<>' })
        .loop(0, false)
        .attr({
          'stroke-dashoffset': '-7'
        });
      this.currentPath.push(line);
    }
  }

  private drawBackground(imgname = this.getFloorImageName(this.currentFloor)): void {
    if (this.backgroundCanvas && imgname) {
      this.backgroundCanvas.clear();
      this.backgroundCanvas.image('assets/floor-plans/' + imgname).size('100%', '100%');
    }
  }

  private getFloorImageName(floor: number): string {
    return floor ? floor + '.svg' : null;
  }

}
