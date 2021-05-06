/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@angular/core';
import { BehaviorSubject, PartialObserver, Subscription } from 'rxjs';
import { environment } from './../../../environments/environment';

const MIN_FLOOR = 1;
const MAX_FLOOR = 4;

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  constructor() {}

  private readonly $floor = new BehaviorSubject(
    Number(window.localStorage.getItem('floor')) || environment.defaultFloor
  );

  public set floor(value: number) {
    if (value >= MIN_FLOOR && value <= MAX_FLOOR) {
      this.$floor.next(value);
      window.localStorage.setItem('floor', String(value));
    }
  }

  public get floor$() {
    return this.$floor.asObservable();
  }

  public get floor(): number {
    return this.$floor.value;
  }

  public isMaxFloor(): boolean {
    return this.$floor.value >= MAX_FLOOR;
  }

  public isMinFloor(): boolean {
    return this.$floor.value <= MIN_FLOOR;
  }

  public setFloorSubscribe(observer: PartialObserver<number>): Subscription {
    return this.$floor.subscribe(observer);
  }
}
