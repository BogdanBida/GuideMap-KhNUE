/* eslint-disable @typescript-eslint/naming-convention */
import { Component } from '@angular/core';
import { FloorService, StateService } from '../../../../core/services';

@Component({
  selector: 'app-floor-switcher',
  templateUrl: './floor-switcher.component.html',
  styleUrls: ['./floor-switcher.component.scss'],
})
export class FloorSwitcherComponent {
  constructor(
    public floorService: FloorService,
    private readonly stateService: StateService
  ) {}

  public upFloor(): void {
    this.stateService.drawPath();
    this.floorService.floor++;
  }

  public downFloor(): void {
    this.stateService.drawPath();
    this.floorService.floor--;
  }
}
