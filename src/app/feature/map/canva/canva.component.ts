import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Svg, SVG } from '@svgdotjs/svg.js';
import { environment } from './../../../../environments/environment.prod';
import { LocationNode } from './../../../shared/models/location-node';

const userLocationColor = '#ff0010';
const endpointColor = '#5020ff';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
})
export class CanvaComponent implements OnInit, OnChanges {
  private strokeConfig = {
    width: 5,
    color: '#f06',
    linecap: 'round',
    linejoin: 'round',
  };

  @Input() set floor(value: number) {
    this.floorPrivate = value;
    this.drawBackground();
  }

  get floor(): number {
    return this.floorPrivate;
  }

  private _userLocation;
  private _endpoint;

  @Input() set userLocation(value: LocationNode) {
    this.drawUserLocation(value);
    this._userLocation = value;
  }
  @Input() set endpoint(value: LocationNode) {
    this.drawEndpointLocation(value);
    this._endpoint = value;
  }
  @Input() isGoto;

  private draw: Svg;
  private bgrDraw: Svg;
  private floorPrivate: number = environment.defaultFloor;
  private userDot;
  private endpointDot;

  constructor() { }

  ngOnInit(): void {
    this.bgrDraw = SVG().addTo('#bgr-canv').size('3500px', '2550px');
    this.draw = SVG().addTo('#canv').size('3500px', '2550px');
    this.drawBackground(this.getImgName(this.floor));
  }

  ngOnChanges({ isGoto }: SimpleChanges): void {
    if (isGoto.previousValue !== isGoto.currentValue) {
      if (this.isGoto) {
        this.drawPath();
      }
    }
  }

  private getImgName(floor: number): string {
    return floor ? (floor + '.svg') : null;
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
    this.endpointDot = this.drawPoint(this.endpointDot, location, endpointColor);
  }

  private drawPoint(Dot: any, location: LocationNode, color: string = '#505050'): any {
    if (Dot) {
      Dot.remove();
    }
    if (this.draw) {
      const r = 25;
      const maxr = 2500;
      const [x, y] = [location.x, location.y];
      Dot = this.draw.circle(maxr)
        .attr({ fill: color, opacity: 0 })
        .move(x - maxr / 2, y - maxr / 2);
      Dot.animate({ duration: 2500 }).size(r, r).attr({ fill: color, opacity: 0.75 });
      Dot.animate({ ease: '<' });
      Dot.animate({ duration: 1000, ease: '<>' }).loop(true, true).size(r + 20, r + 20).attr({ opacity: 0.4 });
    }
    return Dot;
  }

  private drawPath(): void {
    this.draw.line(this._userLocation.x, this._userLocation.y, this._endpoint.x, this._endpoint.y)
    .stroke(this.strokeConfig);
  }
}
