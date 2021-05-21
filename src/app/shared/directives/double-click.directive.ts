import {
  Directive,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Subject } from 'rxjs';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';

const DEFAULT_DEBOUNCE_TIME = 250;

@UntilDestroy()
@Directive({
  selector: '[appDoubleClick]',
})
export class DoubleClickDirective implements OnInit {
  @Output() public doubleClick = new EventEmitter<MouseEvent>();

  @Input() public debounceTime = DEFAULT_DEBOUNCE_TIME;

  public click$ = new Subject<MouseEvent>();

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    this.click$.next(event);
  }

  public ngOnInit(): void {
    this.click$
      .pipe(
        buffer(this.click$.pipe(debounceTime(this.debounceTime))),
        filter((list) => list.length === 2),
        map((list) => list[1]),
        untilDestroyed(this)
      )
      .subscribe(this.doubleClick);
  }
}
