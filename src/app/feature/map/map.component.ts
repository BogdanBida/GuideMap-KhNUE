import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GMPRouterService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { InfoDialogComponent } from './dialogs/info-dialog/info-dialog.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(
    private readonly _dialog: MatDialog,
    private readonly _gmpRouterService: GMPRouterService
  ) {}

  public x: number;

  public y: number;

  public zoomFactor: number = environment.defaultZoomFactor;

  public ngOnInit(): void {
    this._gmpRouterService.init();
  }

  public openDialog(): void {
    const dialogRef = this._dialog.open(InfoDialogComponent);

    dialogRef.addPanelClass('fullscreen-modal');
    dialogRef.afterClosed().subscribe();
  }
}
