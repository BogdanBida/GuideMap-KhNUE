import { Component, OnInit } from '@angular/core';
import { GMPRouterService } from 'src/app/core/services';
import { SearchbarService } from './../../core/services/searchbar.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements OnInit {
  constructor(
    private readonly _gmpRouterService: GMPRouterService,
    private readonly _searchbarService: SearchbarService
  ) {}

  public readonly searchBarIsHidenOnMobile$ =
    this._searchbarService.isHidenOnMobile$;

  public ngOnInit(): void {
    this._gmpRouterService.init();
  }
}
