/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Component, HostListener, isDevMode, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(public dialog: MatDialog) {}

  public x: number;

  public y: number;

  public zoomFactor: number = environment.defaultZoomFactor;

  public isDevMode = isDevMode();

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.x = event.layerX;
    this.y = event.layerY;
  }

  ngOnInit(): void {}

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent);

    dialogRef.addPanelClass('fullscreen-modal');
    dialogRef.afterClosed().subscribe();
  }
}
