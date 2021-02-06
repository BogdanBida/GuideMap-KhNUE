import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingsDialogComponent } from './settings-dialog/settings-dialog.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
