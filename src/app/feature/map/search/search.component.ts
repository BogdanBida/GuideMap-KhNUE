import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslateService } from '@ngx-translate/core';
import { SearchbarService } from 'src/app/core/services';
import { environment } from 'src/environments/environment';
import { LabelText } from '../../../../app/core/enums';
import {
  MapDataProviderService,
  MapPathService,
  MapService,
} from '../../../core/services';
import { IOptionGroup } from '../interfaces';

@UntilDestroy()
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  constructor(
    private readonly _mapService: MapService,
    private readonly _mapDataProviderService: MapDataProviderService,
    private readonly _mapPathService: MapPathService,
    private readonly _translateService: TranslateService,
    private readonly _searchbarService: SearchbarService
  ) {}

  public readonly isHidenOnMobile$ = this._searchbarService.isHidenOnMobile$;

  public readonly selectedUserLocationName$ =
    this._mapPathService.selectedUserLocationName$;

  public readonly selectedDestinationName$ =
    this._mapPathService.selectedDestinationName$;

  public readonly spriteIconsUrl = environment.spriteIconsPath;

  public readonly labelText = LabelText;

  public destinationGroups = [] as IOptionGroup[];

  public userLocationGroups = [] as IOptionGroup[];

  public setLocation(value: string): void {
    value && value.length && this.findUserLocation(value);
  }

  public setDestination(value: string): void {
    value && value.length && this.findDestination(value);
  }

  public ngOnInit(): void {
    const { qrCodes$, rooms$ } = this._mapDataProviderService;

    // TODO: split rooms and qr codes into groups
    qrCodes$.pipe(untilDestroyed(this)).subscribe((qrCodes) => {
      qrCodes.length &&
        this.userLocationGroups.push({
          groupName: this._translateService.instant('UI.LOCATION_GROUPS.QR'),
          values: qrCodes.map(({ properties }) => {
            return {
              value: String(properties.id),
              viewValue: properties.name,
            };
          }),
        });
    });

    rooms$.pipe(untilDestroyed(this)).subscribe((rooms) => {
      if (rooms.length) {
        this.destinationGroups.push({
          groupName: this._translateService.instant(
            'UI.LOCATION_GROUPS.COMMON'
          ),
          values: rooms.map(({ properties }) => {
            return {
              value: String(properties.id),
              viewValue: properties.name,
            };
          }),
        });
        this.userLocationGroups.push({
          groupName: this._translateService.instant('UI.LOCATION_GROUPS.OTHER'),
          values: rooms.map(({ properties }) => {
            return {
              value: String(properties.id),
              viewValue: properties.name,
            };
          }),
        });
      }
    });
  }

  public findUserLocation(userLocationName: string): void {
    this._mapService.findAndSetLocationByName(userLocationName);
  }

  public findDestination(destinationName: string): void {
    this._mapService.findAndSetEndpointByName(destinationName);
  }
}
