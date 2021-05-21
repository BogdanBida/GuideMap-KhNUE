import { Component, OnInit } from '@angular/core';
import { GMPRouterService } from 'src/app/core/services';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(private readonly _gmpRouterService: GMPRouterService) {}

  public ngOnInit(): void {
    this._gmpRouterService.init();
  }
}
