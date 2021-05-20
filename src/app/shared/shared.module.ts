import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DisableBrowserZoomDirective,
  DisableContextmenuDirective,
} from './directives';
import { DoubleClickDirective } from './directives/double-click.directive';
import { MouseWheelDirective } from './directives/mouse-wheel.directive';

@NgModule({
  declarations: [
    DisableBrowserZoomDirective,
    DisableContextmenuDirective,
    MouseWheelDirective,
    DoubleClickDirective,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    TranslateModule,
    DisableBrowserZoomDirective,
    DisableContextmenuDirective,
    MouseWheelDirective,
    DoubleClickDirective,
  ],
})
export class SharedModule {}
