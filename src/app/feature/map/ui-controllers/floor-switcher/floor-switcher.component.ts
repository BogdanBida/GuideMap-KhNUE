import { Component } from '@angular/core';
import { FloorService } from '../../../../core/services';

@Component({
  selector: 'app-floor-switcher',
  templateUrl: './floor-switcher.component.html',
  styleUrls: ['./floor-switcher.component.scss']
})
export class FloorSwitcherComponent {

  constructor(public floorService: FloorService) { }

  public upFloor(): void {
    this.floorService.floor++;
  }

  public downFloor(): void {
    this.floorService.floor--;
  }

}
