import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';
import { IOptionGroup } from '../interfaces';
import { MapDataProviderService, MapService } from './../../../core/services';

enum LabelText {
  Location = 'UI.ENTER_LOCATION',
  Destination = 'UI.ENTER_ROOM',
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  constructor(
    private readonly _mapService: MapService,
    private readonly _mapDataProviderService: MapDataProviderService,
    private readonly _translateService: TranslateService
  ) {}

  public readonly spriteIconsUrl = environment.spriteIconsPath;
  public readonly labelText = LabelText;

  public setLocation(value: string): void {
    value && value.length && this.findUserLocation(value);
  }
  public setDestination(value: string): void {
    value && value.length && this.findDestination(value);
  }

  public destinationGroups = [] as IOptionGroup[];
  public userLocationGroups = [] as IOptionGroup[];

  public ngOnInit(): void {
    const { qrCodes$, rooms$ } = this._mapDataProviderService;

    // TODO: split rooms and qr codes into groups (in scope of task: https://trello.com/c/JhfD3q4U/14-app-split-rooms-and-qr-codes-into-groups)
    qrCodes$.subscribe((qrCodes) => {
      qrCodes.length &&
        this.userLocationGroups.push({
          groupName: this._translateService.instant('UI.QRCODE_GROUPS.COMMON'),
          values: qrCodes.map(({ properties }) => {
            return {
              value: String(properties.id),
              viewValue: properties.name,
            };
          }),
        });
    });
    rooms$.subscribe((rooms) => {
      rooms.length &&
        this.destinationGroups.push({
          groupName: this._translateService.instant(
            'UI.ROOM_GROUPS.CLASSROOMS'
          ),
          values: rooms.map(({ properties }) => {
            return {
              value: String(properties.id),
              viewValue: properties.name,
            };
          }),
        });
    });
  }

  public findUserLocation(userLocationName: string): void {
    this._mapService.findAndSetLocationByName(userLocationName);
  }

  public findDestination(destinationName: string): void {
    this._mapService.findAndSetEndpointByName(destinationName);
  }
}
