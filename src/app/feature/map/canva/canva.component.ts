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

  @Input() floor;
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

  private drawBackground(imgname): void {
    if (this.draw) {
      this.draw.clear();
      this.draw.image('assets/floor-plans/' + imgname).size('100%', '100%');
    }
  }
}
