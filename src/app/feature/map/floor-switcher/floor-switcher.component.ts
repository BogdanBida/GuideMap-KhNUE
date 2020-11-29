import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-floor-switcher',
  templateUrl: './floor-switcher.component.html',
  styleUrls: ['./floor-switcher.component.scss']
})
export class FloorSwitcherComponent implements OnInit {

  public readonly minFloor = 1;
  public readonly maxFloor = 4;

  private floorPrivate;

  public set floor(value: number) {
    if ((value > this.maxFloor) && (value < this.minFloor)) { return; }
    this.setFloor.emit(value);
    this.floorPrivate = value;
  }

  public get floor(): number {
    return this.floorPrivate;
  }

  @Output() setFloor = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
    this.floor = 2;
  }

  public upFloor(): void {
    if (this.floor < this.maxFloor) {
      this.floor++;
    }
  }

  public downFloor(): void {
    if (this.floor > this.minFloor) {
      this.floor--;
    }
  }

}
