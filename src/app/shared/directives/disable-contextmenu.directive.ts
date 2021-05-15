import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableContextmenu]',
})
export class DisableContextmenuDirective {
  @HostListener('contextmenu', ['$event'])
  public handler(event: MouseEvent): void {
    event.preventDefault();
  }
}
