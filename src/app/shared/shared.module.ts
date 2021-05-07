import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DisableBrowserZoomDirective } from './directives/disable-browser-zoom.directive';

@NgModule({
  declarations: [DisableBrowserZoomDirective],
  imports: [CommonModule],
  exports: [CommonModule, TranslateModule, DisableBrowserZoomDirective],
})
export class SharedModule {}
