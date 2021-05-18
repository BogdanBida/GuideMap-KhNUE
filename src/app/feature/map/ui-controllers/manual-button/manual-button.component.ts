import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ManualDialogComponent } from '../../dialogs/manual-dialog/manual-dialog.component';

@Component({
  selector: 'app-manual-button',
  templateUrl: './manual-button.component.html',
  styleUrls: ['./manual-button.component.scss'],
})
export class ManualButtonComponent {
  constructor(private readonly _dialog: MatDialog) {}

  public openDialog(): void {
    this._dialog.open(ManualDialogComponent, {
      panelClass: 'fullscreen-modal',
    });
  }
}
