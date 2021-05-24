import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchbarService {
  public readonly isHidenOnMobile$ = new BehaviorSubject<boolean>(true);

  public toogleVisibilitySearchbar(): void {
    this.isHidenOnMobile$.next(!this.isHidenOnMobile$.getValue());
  }
}
