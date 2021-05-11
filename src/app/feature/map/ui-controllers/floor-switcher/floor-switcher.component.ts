import { Component, HostListener } from '@angular/core';
import { FloorService } from '../../../../core/services';

@Component({
  selector: 'app-floor-switcher',
  templateUrl: './floor-switcher.component.html',
  styleUrls: ['./floor-switcher.component.scss'],
})
export class FloorSwitcherComponent {
  constructor(private readonly _floorService: FloorService) {
    this.floorList = _floorService.floorList;
  }

  public readonly floorList: number[];

  public readonly floorNumberPositionStyle$ =
    this._floorService.floorNumberPositionStyle$;

  public readonly isMinFloor$ = this._floorService.isMinFloor$;

  public readonly isMaxFloor$ = this._floorService.isMaxFloor$;

  @HostListener('wheel', ['$event'])
  public onWheel(event: WheelEvent): void {
    event.deltaY < -1 && this.upFloor();
    event.deltaY > 1 && this.downFloor();
  }

  public upFloor(): void {
    this._floorService.floor++;
  }

  public downFloor(): void {
    this._floorService.floor--;
  }
}
