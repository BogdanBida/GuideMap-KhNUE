import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DisableBrowserZoomDirective,
  DisableContextmenuDirective,
} from './directives';
import { MouseWheelDirective } from './directives/mouse-wheel.directive';

@NgModule({
  declarations: [
    DisableBrowserZoomDirective,
    DisableContextmenuDirective,
    MouseWheelDirective,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    TranslateModule,
    DisableBrowserZoomDirective,
    DisableContextmenuDirective,
    MouseWheelDirective,
  ],
})
export class SharedModule {}
