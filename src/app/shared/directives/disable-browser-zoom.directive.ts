import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appDisableBrowserZoom]',
})
export class DisableBrowserZoomDirective {
  @HostListener('wheel', ['$event'])
  public onWheel(event: MouseEvent): void {
    if (event.ctrlKey) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
}
