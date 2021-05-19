import { Injectable } from '@angular/core';
import { range } from 'lodash-es';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { getSlideTransform } from '../utils';
import { environment } from './../../../environments/environment';

const MIN_FLOOR = 1;
const MAX_FLOOR = 4;
const FLOOR_LIST = range(MIN_FLOOR, MAX_FLOOR + 1).reverse();

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  public readonly floor$ = new BehaviorSubject(
    Number(window.localStorage.getItem('floor')) || environment.defaultFloor
  );

  public readonly floorList = FLOOR_LIST;

  public readonly isMaxFloor$ = this.floor$.pipe(
    map((floor) => floor >= MAX_FLOOR)
  );

  public readonly isMinFloor$ = this.floor$.pipe(
    map((floor) => floor <= MIN_FLOOR)
  );

  public readonly floorNumberPositionStyle$ = this.floor$.pipe(
    map((floor) => getSlideTransform(floor, MAX_FLOOR))
  );

  public set floor(value: number) {
    if (value >= MIN_FLOOR && value <= MAX_FLOOR) {
      this.floor$.next(value);
      window.localStorage.setItem('floor', String(value));
    }
  }

  public get floor(): number {
    return this.floor$.value;
  }

  public upFloor(): void {
    this.floor++;
  }

  public downFloor(): void {
    this.floor--;
  }

  public setFloorSubscribe(observer: any): Subscription {
    return this.floor$.subscribe(observer);
  }

  public getFloorImageName(): string {
    return this.floor ? this.floor + '.svg' : null;
  }
}
