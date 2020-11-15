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
  
  private corpsName = 'mc_';
  @Input() floor: Number = 1;
  private draw: Svg;

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['floor'].currentValue != changes['floor'].previousValue) {
      var imgname = this.corpsName + changes['floor'].currentValue + 'f.jpg';
      this.drawBackground(imgname);
    }
  }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          
  ngOnInit() {                                
    var imgname = this.corpsName + this.floor + 'f.jpg';
    this.draw = SVG().addTo('#canv').size('1400', '1400');
    this.drawBackground(imgname);
  }

  private drawBackground(imgname) {
    if (this.draw) {
      this.draw.clear();
      console.log(imgname);
      this.draw.image('assets/floor-plans/' + imgname).size('100%', '100%');
    }
  }
}
