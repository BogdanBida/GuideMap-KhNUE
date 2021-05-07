import { Component } from '@angular/core';
import { FloorService } from '../../../../core/services';

@Component({
  selector: 'app-floor-switcher',
  templateUrl: './floor-switcher.component.html',
  styleUrls: ['./floor-switcher.component.scss'],
})
export class FloorSwitcherComponent {
  constructor(private readonly _floorService: FloorService) {}

  public readonly floorNumberPositionStyle$ = this._floorService
    .floorNumberPositionStyle$;

  public readonly isMinFloor$ = this._floorService.isMinFloor$;

  public readonly isMaxFloor$ = this._floorService.isMaxFloor$;

  public upFloor(): void {
    this._floorService.floor++;
  }

  public downFloor(): void {
    this._floorService.floor--;
  }
}
