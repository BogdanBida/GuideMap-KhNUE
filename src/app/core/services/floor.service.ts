import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { environment } from './../../../environments/environment';

const MIN_FLOOR = 1;
const MAX_FLOOR = 4;

@Injectable({
  providedIn: 'root'
})
export class FloorService {
  private $floor = new BehaviorSubject(environment.defaultFloor);

  constructor() { }

  public set floor(value: number) {
    if (value >= MIN_FLOOR && value <= MAX_FLOOR) { this.$floor.next(value); }
  }

  public get floor(): number { return this.$floor.value; }

  public isMaxFloor(): boolean {
    return this.$floor.value >= MAX_FLOOR;
  }

  public isMinFloor(): boolean {
    return this.$floor.value <= MIN_FLOOR;
  }

  public setFloorSubscribe(observer): Subscription {
    return this.$floor.subscribe(observer);
  }

}
