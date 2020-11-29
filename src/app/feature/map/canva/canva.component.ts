import { LocationNode } from './../../../shared/models/location-node';
import { Component, Input, OnInit, ChangeDetectionStrategy, OnChanges, SimpleChanges } from '@angular/core';
import { Svg, SVG } from '@svgdotjs/svg.js';

@Component({
  selector: 'app-canva',
  templateUrl: './canva.component.html',
  styleUrls: ['./canva.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CanvaComponent implements OnChanges, OnInit {
  private strokeConfig = {
    width: 5,
    color: '#f06',
    linecap: 'round',
    linejoin: 'round',
  };

  @Input() floor = 2;
  @Input() set userLocation(val: LocationNode) {
    this._userLocation = val;
    this.drawPoint(val);
  }
  @Input() set endpoint(val: LocationNode) {
    this._endpoint = val;
    this.drawPoint(val);
  }

  private _userLocation: LocationNode;
  private _endpoint: LocationNode;
  private draw: Svg;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.floor.currentValue !== changes.floor.previousValue) {
      this.drawBackground(this.getImgName(changes.floor.currentValue));
    }
  }

  ngOnInit(): void {
    this.draw = SVG().addTo('#canv').size('1400px', '1400px');
    this.drawBackground(this.getImgName(this.floor));
  }

  private getImgName(floor: number): string {
    return floor + '.svg';
  }

  private drawBackground(imgname = this.getImgName(this.floor)): void {
    if (this.draw) {
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
      .attr({fill: '#ff0000', opacity: 0})
      .move(location.x - maxr / 2, location.y - maxr / 2);
      circle.animate(2500).size(r, r).attr({fill: '#ff0010', opacity: 0.75});
      circle.animate({ease: '<'});
    }
  }
}
