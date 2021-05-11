import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  DisableBrowserZoomDirective,
  DisableContextmenuDirective,
} from './directives';

@NgModule({
  declarations: [DisableBrowserZoomDirective, DisableContextmenuDirective],
  imports: [CommonModule],
  exports: [
    CommonModule,
    TranslateModule,
    DisableBrowserZoomDirective,
    DisableContextmenuDirective,
  ],
})
export class SharedModule {}
