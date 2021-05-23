import { Component } from '@angular/core';
import { PanZoomService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-centered-button',
  templateUrl: './centered-button.component.html',
  styleUrls: ['./centered-button.component.scss'],
})
export class CenteredButtonComponent {
  constructor(private readonly _panzoomService: PanZoomService) {}

  public readonly spriteIconsUrl = environment.spriteIconsPath;

  public centeredView(): void {
    this._panzoomService.resetView();
  }
}
