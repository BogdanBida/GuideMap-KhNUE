/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/adjacent-overload-signatures */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Injectable } from '@angular/core';
import { range } from 'lodash';
import { BehaviorSubject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

const MIN_FLOOR = 1;
const MAX_FLOOR = 4;
const ONE_HUNDRED = 100;

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  public readonly floor$ = new BehaviorSubject(
    Number(window.localStorage.getItem('floor')) || environment.defaultFloor
  );

  public readonly floorList = range(MIN_FLOOR, MAX_FLOOR + 1).reverse();

  public readonly isMaxFloor$ = this.floor$.pipe(
    map((floor) => floor >= MAX_FLOOR)
  );

  public readonly isMinFloor$ = this.floor$.pipe(
    map((floor) => floor <= MIN_FLOOR)
  );

  public readonly floorNumberPositionStyle$ = this.floor$.pipe(
    map((floor) => {
      return {
        transform:
          'translateY(' +
          Number((1 - MAX_FLOOR) * ONE_HUNDRED + (floor - 1) * ONE_HUNDRED) +
          '%)',
      };
    })
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

  public setFloorSubscribe(observer: any): Subscription {
    return this.floor$.subscribe(observer);
  }

  public getFloorImageName(): string {
    return this.floor ? this.floor + '.svg' : null;
  }
}
