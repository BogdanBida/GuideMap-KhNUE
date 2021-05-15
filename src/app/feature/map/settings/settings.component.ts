/* eslint-disable @typescript-eslint/no-empty-function */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from '../dialogs/settings-dialog/settings-dialog.component';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  constructor(public dialog: MatDialog) {}

  public readonly iconPath = environment.spriteIconsPath + 'settings';

  public openDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent);

    dialogRef.afterClosed().subscribe((_result) => {});
  }
}
