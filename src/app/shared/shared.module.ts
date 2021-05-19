import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DisableBrowserZoomDirective,
  DisableContextmenuDirective,
} from './directives';
import { DbClickDirective } from './directives/dbclick.directive';
import { MouseWheelDirective } from './directives/mouse-wheel.directive';

@NgModule({
  declarations: [
    DisableBrowserZoomDirective,
    DisableContextmenuDirective,
    MouseWheelDirective,
    DbClickDirective,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    TranslateModule,
    DisableBrowserZoomDirective,
    DisableContextmenuDirective,
    MouseWheelDirective,
    DbClickDirective,
  ],
})
export class SharedModule {}
