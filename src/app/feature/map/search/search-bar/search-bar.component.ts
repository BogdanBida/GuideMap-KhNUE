/* eslint-disable @typescript-eslint/naming-convention */
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GuideMapFeaturePointCategory } from 'src/app/core/enums';
import {
  GuideMapFeaturePoint,
  GuideMapRoomProperties,
} from '../../../../core/models';
import {
  MapDataProviderService,
  MapService,
} from './../../../../core/services';

interface IRoom {
  value: string;
  viewValue: string;
}

export interface IStateGroup {
  groupName: string;
  rooms: IRoom[];
}

export const $filter = (opt: IRoom[], value: string): IRoom[] => {
  const filterValue = value.toLowerCase();

  return opt.filter(
    (item) => item.viewValue.toLowerCase().indexOf(filterValue) === 0
  );
};

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  constructor(
    private readonly _mapService: MapService,
    private readonly _mapDataProviderService: MapDataProviderService,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService
  ) {
    this.stateGroups = [];
  }

  @Input() svgIconUrl: string;
  @Input() labelText: string;

  public locations: GuideMapFeaturePoint[];

  public stateForm: FormGroup = this.fb.group({
    stateGroup: '338',
  });

  public stateGroups: IStateGroup[];

  public stateGroupOptions: Observable<IStateGroup[]>;

  public ngOnInit(): void {
    this._mapDataProviderService.getFeaturePoints().subscribe((data) => {
      this.locations = data;
      this.stateGroups.push({
        groupName: this.translateService.instant('UI.ROOM_GROUPS.CLASSROOMS'),
        rooms: data
          .filter((item) => {
            return (
              item.properties.category === GuideMapFeaturePointCategory.Room
            );
          })
          .map(({ properties }) => {
            return {
              value: String(properties.id),
              viewValue: properties.name,
            };
          }),
      });
    });

    this.stateGroupOptions = this.stateGroupControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value))
    );
  }

  public clear(): void {
    // TODO: clear logic
  }

  public findLocation(): void {
    const foundLocation = this.locations.find((roomNode) => {
      return this.stateGroupControl.value === roomNode.properties.name;
    });

    this._mapService.setFinalEndpoint(
      (foundLocation.properties as unknown) as GuideMapRoomProperties
    );
  }

  private _filterGroup(value: string): IStateGroup[] {
    if (value) {
      return this.stateGroups
        .map((group) => ({
          groupName: group.groupName,
          rooms: $filter(group.rooms, value),
        }))
        .filter((group) => group.rooms.length > 0);
    }

    return this.stateGroups;
  }

  private get stateGroupControl(): AbstractControl {
    return this.stateForm.get('stateGroup');
  }
}
