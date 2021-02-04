import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Svg, SVG } from '@svgdotjs/svg.js';
import { combineLatest, Subscription } from 'rxjs';
import { FloorService } from './../../../core/services/floor.service';
import { NodeService } from './../../../core/services/node.service';
import { StateService } from './../../../core/services/state.service';
import { LocationNode } from './../../../shared/models/location-node';

const userLocationColor = '#ff0010';
const endpointColor = '#5020ff';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
})
export class CanvaComponent implements OnInit, OnChanges, OnDestroy {
  private strokeConfig = {
    width: 5,
    color: '#ff0080',
    linecap: 'round',
    linejoin: 'round',
    dasharray: '1,7',
  };

  @Input() isGoto;

  public floor: number;

  private draw: Svg;
  private bgrDraw: Svg;
  private userDot;
  private endpointDot;
  private routes;
  private paths;
  private path = [];
  private floorSubscription: Subscription;
  private userLocSubscription: Subscription;
  private endpSubscription: Subscription;
  public styles = {};

  constructor(
    private stateService: StateService,
    private nodeService: NodeService,
    private floorService: FloorService,
  ) { }

  ngOnInit(): void {
    this.bgrDraw = SVG().addTo('#bgr-canv').size('3500px', '2550px');
    this.draw = SVG().addTo('#canv').size('3500px', '2550px');
    this.drawBackground(this.getImgName(this.floor));

    combineLatest([
      this.nodeService.getRouteNodes(),
      this.nodeService.getPaths(),
    ]).subscribe(([nodes, paths]) => {
      this.routes = nodes;
      this.paths = paths[0];
    });

    this.floorSubscription = this.floorService.setFloorSubscribe((floor) => {
      this.floor = floor;
      this.drawBackground();
    });

    combineLatest([
      this.stateService.getUserLocationBehaviorSubject(),
      this.stateService.getEndpointBehaviorSubject()
    ]).subscribe(([userLocation, endpoint]) => {
      userLocation && this.drawUserLocation(userLocation);
      if (endpoint) {
        this.clearPath();
        this.drawEndpointLocation(endpoint);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const { isGoto } = changes;
    isGoto && this.isGoto && this.drawPath();
  }

  ngOnDestroy(): void {
    this.floorSubscription.unsubscribe();
  }

  public change(): void {
    this.styles = {
      transform: `translate(${0}%, ${-50}%)`
    };
  }

  private getImgName(floor: number): string {
    return floor ? floor + '.svg' : null;
  }

  private drawBackground(imgname = this.getImgName(this.floor)): void {
    if (this.bgrDraw && imgname) {
      this.bgrDraw.clear();
      this.bgrDraw.image('assets/floor-plans/' + imgname).size('100%', '100%');
    }
  }

  private drawUserLocation(location: LocationNode): void {
    this.userDot = this.drawPoint(this.userDot, location, userLocationColor);
  }

  private drawEndpointLocation(location: LocationNode): void {
    this.endpointDot = this.drawPoint(
      this.endpointDot,
      location,
      endpointColor
    );
  }

  private drawPoint(
    Dot: any,
    location: LocationNode,
    color: string = '#505050'
  ): any {
    if (Dot) {
      Dot.remove();
    }
    if (this.draw && location) {
      const r = 25;
      const maxr = 2500;
      const [x, y] = [location.x, location.y];
      Dot = this.draw
        .circle(maxr)
        .attr({ fill: color, opacity: 0 })
        .move(x - maxr / 2, y - maxr / 2);
      Dot.animate({ duration: 2500 })
        .size(r, r)
        .attr({ fill: color, opacity: 0.75 });
      Dot.animate({ ease: '<' });
      Dot.animate({ duration: 1000, ease: '<>' })
        .loop(true, true)
        .size(r + 20, r + 20)
        .attr({ opacity: 0.4 });
    }
    return Dot;
  }

  private clearPath(): void {
    this.path.map((v) => v.remove());
    this.path = [];
  }

  private drawPath(): void {
    this.clearPath();
    const { userLocation, endpoint } = this.stateService;
    const path = this.paths[userLocation.id + '-' + endpoint.id];
    const dots = [
      { x: userLocation.x, y: userLocation.y },
      // fake path searching
      ...path.map(v => (this.routes[v])),
      { x: endpoint.x, y: endpoint.y },
    ];

    for (let i = 0; i < dots.length - 1; i++) {
      const line = this.draw
        .line(dots[i].x, dots[i].y, dots[i + 1].x, dots[i + 1].y)
        .stroke(this.strokeConfig)
        .attr({
          'stroke-dashoffset': '0'
        });
      line
        .animate({ duration: 700, ease: '<>' })
        .loop(0, false)
        .attr({
          'stroke-dashoffset': '-7'
        });
      this.path.push(line);
    }
  }

  public onmousedown(event, target): void {
    target.ondragstart = () => {
      return false;
    };

    const coords = getCoords(target);
    const shiftX = event.pageX - coords.left;
    const shiftY = event.pageY - coords.top;

    target.style.position = 'absolute';
    moveAt(event);
    document.body.appendChild(target);

    function moveAt(e): void {
      target.style.left = e.pageX - shiftX + 'px';
      target.style.top = e.pageY - shiftY + 'px';

      const left = +target.style.left.replace('px', '');
      const top = +target.style.top.replace('px', '');

      if (left > 0) {
        target.style.left = 0;
      }
      const maxWidth = 3500 - window.innerWidth;
      if (left < -maxWidth) {
        target.style.left = `-${maxWidth}px`;
      }
      if (top > 0) {
        target.style.top = 0;
      }
      const maxHeight = 2550 - window.innerHeight;
      if (top < -maxHeight) {
        target.style.top = `-${maxHeight}px`;
      }
    }

    document.onmousemove = (e) => {
      moveAt(e);
    };

    target.onmouseup = () => {
      document.onmousemove = null;
      target.onmouseup = null;
    };

    function getCoords(elem): { top: number, left: number } {
      const box = elem.getBoundingClientRect();
      return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
      };
    }
  }
}
