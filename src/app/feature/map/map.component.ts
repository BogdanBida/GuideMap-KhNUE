import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  public isGoto = 0;
  public x: number;
  public y: number;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    document.body.addEventListener('mousemove', (event) => {
      // tslint:disable-next-line: no-string-literal
      this.x = event['layerX'];
      // tslint:disable-next-line: no-string-literal
      this.y = event['layerY'];
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(InfoDialogComponent);
    dialogRef.afterClosed().subscribe();
  }
}
