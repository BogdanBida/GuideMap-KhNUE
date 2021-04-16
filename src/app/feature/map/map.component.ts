import { Component, isDevMode, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public x: number;
  public y: number;
  public zoomFactor: number = environment.defaultZoomFactor;
  public isDevMode = isDevMode();

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    document.body.addEventListener('mousemove', (event) => {
      // tslint:disable-next-line: no-string-literal
      this.x = event['layerX'];
      // tslint:disable-next-line: no-string-literal
      this.y = event['layerY'];
    });
    document.addEventListener('wheel', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.addPanelClass('fullscreen-modal');
    dialogRef.afterClosed().subscribe();
  }
}
