/* eslint-disable @typescript-eslint/naming-convention */
import { Component, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { GuideMapFeaturePointCategory } from 'src/app/core/enums';
import {
  GuideMapFeaturePoint,
  GuideMapRoomProperties,
} from '../../../core/models';
import { MapDataProviderService, MapService } from './../../../core/services';
import { IOption, IOptionGroup } from './search-bar/search-bar.component';

export const $filter = (opt: IOption[], value: string): IOption[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(
    (item) => item.viewValue.toLowerCase().indexOf(filterValue) === 0
  );
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  constructor(
    private readonly _mapService: MapService,
    private readonly _mapDataProviderService: MapDataProviderService,
    private readonly translateService: TranslateService
  ) {
    this.destinationGroups = [];
    this.userLocationGroups = [];
  }

  @Output() set location(value: string) {
    value && value.length && this.findUserLocation(value);
  }
  @Output() set destination(value: string) {
    value && value.length && this.findDestination(value);
  }

  public featurePoints: GuideMapFeaturePoint[];

  public destinationGroups: IOptionGroup[];
  public userLocationGroups: IOptionGroup[];

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
        groupName: this.translateService.instant('UI.QRCODE_GROUPS.COMMON'),
        rooms: qrCodes.map(({ properties }) => {
          return {
            value: String(properties.id),
            viewValue: properties.name,
          };
        }),
      });
      this.destinationGroups.push({
        groupName: this.translateService.instant('UI.ROOM_GROUPS.CLASSROOMS'),
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
