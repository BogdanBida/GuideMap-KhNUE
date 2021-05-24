import { Component } from '@angular/core';
import { SearchbarService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-search-bar-toggler',
  templateUrl: './search-bar-toggler.component.html',
  styleUrls: ['./search-bar-toggler.component.scss'],
})
export class SearchBarTogglerComponent {
  constructor(private readonly _searchbarService: SearchbarService) {}

  public readonly spriteIconsUrl = environment.spriteIconsPath;

  public readonly isHidenOnMobile$ = this._searchbarService.isHidenOnMobile$;

  public toogleMobileVisibility(): void {
    this._searchbarService.toogleVisibilitySearchbar();
  }
}
