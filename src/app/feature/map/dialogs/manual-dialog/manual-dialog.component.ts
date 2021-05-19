import { Component } from '@angular/core';
import { ManualTitleTranslateKeys } from 'src/app/core/enums/manual-titles.translate-keys.enum.ts.enum';

@Component({
  selector: 'app-manual-dialog',
  templateUrl: './manual-dialog.component.html',
  styleUrls: ['./manual-dialog.component.scss'],
})
export class ManualDialogComponent {
  public readonly mainTitle = ManualTitleTranslateKeys.Manual;

  public readonly interfaceTitle = ManualTitleTranslateKeys.Interface;

  public readonly authorsTitle = ManualTitleTranslateKeys.Authors;

  public readonly supportTitle = ManualTitleTranslateKeys.Support;

  public readonly footerTitle = ManualTitleTranslateKeys.Footer;
}
