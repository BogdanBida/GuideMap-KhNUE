import { Directive, EventEmitter, HostListener, Output } from '@angular/core';
import * as KeyCode from 'keycode-js';

@Directive({
  selector: '[appKeyboardArrowController]',
})
export class KeyboardArrowControllerDirective {
  @Output() public readonly pressUp = new EventEmitter<KeyboardEvent>();

  @Output() public readonly pressRight = new EventEmitter<KeyboardEvent>();

  @Output() public readonly pressDown = new EventEmitter<KeyboardEvent>();

  @Output() public readonly pressLeft = new EventEmitter<KeyboardEvent>();

  private readonly _keyCodeActions = new Map([
    [KeyCode.CODE_UP, this.pressUp],
    [KeyCode.CODE_RIGHT, this.pressRight],
    [KeyCode.CODE_DOWN, this.pressDown],
    [KeyCode.CODE_LEFT, this.pressLeft],
  ]);

  @HostListener('document:keydown', ['$event'])
  public onKeyPress(event: KeyboardEvent): void {
    const emitter = this._keyCodeActions.get(event.key);

    emitter && emitter.emit(event);
  }
}
