import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-floor-switcher',
  templateUrl: './floor-switcher.component.html',
  styleUrls: ['./floor-switcher.component.scss']
})
export class FloorSwitcherComponent {

  public floor: number;
  @Output() setFloor = new EventEmitter<number>();

  constructor() { this.floor = 1; }

  public changeFloor(delta: number): void {
    if (delta > 0 && this.floor < 8) { this.floor += delta; } else
    if (delta < 0 && this.floor > 1) { this.floor += delta; } else { return; }
    this.setFloor.emit(this.floor);
  }

}
