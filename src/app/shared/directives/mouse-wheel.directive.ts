import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appMouseWheel]',
})
export class MouseWheelDirective {
  @Output() public readonly eventUp = new EventEmitter<WheelEvent>();

  @Output() public readonly eventDown = new EventEmitter<WheelEvent>();

  @HostListener('wheel', ['$event'])
  public handler(event: WheelEvent): void {
    event.deltaY < -1 && this.eventUp.emit(event);
    event.deltaY > 1 && this.eventDown.emit(event);
  }
}
