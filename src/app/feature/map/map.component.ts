import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LocationNode } from './../../shared/models/location-node';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  public userLocation: LocationNode | null = null;
  public endpoint: LocationNode | null = null;
  public isGoto = 0;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.afterClosed().subscribe();
  }
}
