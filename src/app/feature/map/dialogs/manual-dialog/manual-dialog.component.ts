import { Component } from '@angular/core';
import { ManualTranslateKeys } from 'src/app/core/enums/manual.translate-keys.enum';

@Component({
  selector: 'app-manual-dialog',
  templateUrl: './manual-dialog.component.html',
  styleUrls: ['./manual-dialog.component.scss'],
})
export class ManualDialogComponent {

  public readonly mainTitle = ManualTranslateKeys.Title;

  public readonly mainDescription = ManualTranslateKeys.Description;

  public readonly interfaceTitle = ManualTranslateKeys.Interface;

  public readonly authorsTitle = ManualTranslateKeys.Authors;

  public readonly supportTitle = ManualTranslateKeys.Support;

  public readonly footerTitle = ManualTranslateKeys.Footer;

  public readonly interfaceItems = [
    {
      tittle: ManualTranslateKeys.MainMap,
      url: 'assets/guide/main-map.png',
      description: ManualTranslateKeys.MainMapDescription,
    },
    {
      tittle: ManualTranslateKeys.StartPoint,
      url: 'assets/guide/start-point.png',
      description: ManualTranslateKeys.StartPointDescription,
    },
    {
      tittle: ManualTranslateKeys.FinishPoint,
      url: 'assets/guide/finish-point.png',
      description: ManualTranslateKeys.FinishPointDescription,
    },
    {
      tittle: ManualTranslateKeys.FloorSwitch,
      url: 'assets/guide/floor-switch.png',
      description: ManualTranslateKeys.FloorSwitchDescription,
    },
    {
      tittle: ManualTranslateKeys.ZoomEdit,
      url: 'assets/guide/zoom-edit.png',
      description: ManualTranslateKeys.ZoomEditDescription,
    },
    {
      tittle: ManualTranslateKeys.Settings,
      url: 'assets/guide/settings.png',
      description: ManualTranslateKeys.SettingsDescription,
    },
    {
      tittle: ManualTranslateKeys.Manual,
      url: 'assets/guide/manual.png',
      description: ManualTranslateKeys.ManualDescription,
    }
  ];
}
