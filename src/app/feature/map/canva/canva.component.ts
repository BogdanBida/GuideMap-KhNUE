import { Component, OnInit } from '@angular/core';
import { Rect, SVG } from '@svgdotjs/svg.js';
import { BuildingService } from 'src/app/core/services/building.service';

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
  
  private entities;
  private corpsName = 'mc_';
  private floor: Number = 2;
  private imgname: String = this.corpsName + this.floor + 'f.jpg';

  constructor(private buildingService: BuildingService) {}

  ngOnInit() {
    var draw = SVG().addTo('#canv').size('1400', '1400');
    draw.image('assets/floor-plans/' + this.imgname).size('100%', '100%');

    // this.buildingService.getEntitiesData().subscribe((response) => {
    //   this.entities = response.data;
    //   console.log(this.entities);

    //   this.entities.forEach((element) => {
    //     let [X0, Y0] = element.location;
    //     draw
    //       .polyline([...element.coordinates, element.coordinates[0]])
    //       .move(X0, Y0)
    //       .fill('#00000005')
    //       .stroke(this.strokeConfig);
    //   });
    // });
  }
}
