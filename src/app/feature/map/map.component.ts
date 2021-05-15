/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  constructor(public dialog: MatDialog) {}

  public x: number;

  public y: number;

  public zoomFactor: number = environment.defaultZoomFactor;

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent);

    dialogRef.addPanelClass('fullscreen-modal');
    dialogRef.afterClosed().subscribe();
  }
}
