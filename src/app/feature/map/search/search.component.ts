import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GuideMapFeaturePointCategory } from 'src/app/core/enums';
import { environment } from 'src/environments/environment';
import {
  GuideMapFeaturePoint,
  GuideMapRoomProperties,
} from '../../../core/models';
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

  public featurePoints: GuideMapFeaturePoint[];

  public destinationGroups = [] as IOptionGroup[];
  public userLocationGroups = [] as IOptionGroup[];

  public ngOnInit(): void {
    this._mapDataProviderService.getFeaturePoints().subscribe((data) => {
      this.featurePoints = data;
      const qrCodes = data.filter((item) => {
        return item.properties.category === GuideMapFeaturePointCategory.QrCode;
      });
      const rooms = data.filter((item) => {
        return item.properties.category === GuideMapFeaturePointCategory.Room;
      });
      this.userLocationGroups.push({
        // TODO: group logic
        groupName: this._translateService.instant('UI.QRCODE_GROUPS.COMMON'),
        rooms: qrCodes.map(({ properties }) => {
          return {
            value: String(properties.id),
            viewValue: properties.name,
          };
        }),
      });
      this.destinationGroups.push({
        groupName: this._translateService.instant('UI.ROOM_GROUPS.CLASSROOMS'),
        rooms: rooms.map(({ properties }) => {
          return {
            value: String(properties.id),
            viewValue: properties.name,
          };
        }),
      });
    });
  }

  public findUserLocation(userLocationName: string): void {
    const foundLocation = this.featurePoints.find((roomNode) => {
      return userLocationName === roomNode.properties.name;
    });

    foundLocation &&
      this._mapService.setUserLocation(
        (foundLocation.properties as unknown) as GuideMapRoomProperties
      );
  }

  public findDestination(destinationName: string): void {
    const foundDestination = this.featurePoints.find((roomNode) => {
      return destinationName === roomNode.properties.name;
    });

    foundDestination &&
      this._mapService.setFinalEndpoint(
        (foundDestination.properties as unknown) as GuideMapRoomProperties
      );
  }
}
