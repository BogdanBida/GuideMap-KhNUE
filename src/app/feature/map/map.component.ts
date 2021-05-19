/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  public zoomFactor: number = environment.defaultZoomFactor;
}
