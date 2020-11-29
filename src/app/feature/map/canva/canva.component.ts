import { Component, Input, OnInit } from '@angular/core';
import { Svg, SVG } from '@svgdotjs/svg.js';
import { LocationNode } from './../../../shared/models/location-node';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
})
export class CanvaComponent implements OnInit {
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

  @Input() set userLocation(value: LocationNode) {
    this.drawPoint(value);
  }
  @Input() set endpoint(value: LocationNode) {
    this.drawPoint(value);
  }

  private draw: Svg;
  private floorPrivate: number;

  constructor() { }

  ngOnInit(): void {
    this.draw = SVG().addTo('#canv').size('1400px', '1400px');
    this.drawBackground(this.getImgName(this.floor));
  }

  private getImgName(floor: number): string {
    return floor ? (floor + '.svg') : null;
  }

  private drawBackground(imgname = this.getImgName(this.floor)): void {
    if (this.draw && imgname) {
      this.draw.clear();
      this.draw.image('assets/floor-plans/' + imgname).size('100%', '100%');
    }
  }

  private drawPoint(location: LocationNode): void {
    if (this.draw) {
      this.drawBackground();
      const r = 25;
      const maxr = 2500;
      const circle = this.draw.circle(maxr)
        .attr({ fill: '#ff0000', opacity: 0 })
        .move(location.x - maxr / 2, location.y - maxr / 2);
      circle.animate(2500).size(r, r).attr({ fill: '#ff0010', opacity: 0.75 });
      circle.animate({ ease: '<' });
    }
  }
}
