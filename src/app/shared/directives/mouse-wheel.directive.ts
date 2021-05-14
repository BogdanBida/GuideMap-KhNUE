import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appMouseWheel]',
})
export class MouseWheelDirective {
  @Output() public eventUp = new EventEmitter<WheelEvent>();

  @Output() public eventDown = new EventEmitter<WheelEvent>();

  @HostListener('wheel', ['$event'])
  public handler(event: WheelEvent): void {
    event.deltaY < -1 && this.eventUp.emit(event);
    event.deltaY > 1 && this.eventDown.emit(event);
  }
}
