import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SwitchesDialogComponent } from './switches-dialog/switches-dialog.component';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.scss'],
})
export class SwitchesComponent {
  constructor(public dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SwitchesDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}
