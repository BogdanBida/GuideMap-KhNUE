/* eslint-disable @typescript-eslint/naming-convention */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GuideMapFeaturePointCategory } from 'src/app/core/enums';
import {
  GuideMapFeaturePoint,
  GuideMapRoomProperties,
  LocationNode,
} from '../../../core/models';
import { NodeService, StateService } from './../../../core/services';

interface Room {
  value: string;
  viewValue: string;
}

export interface StateGroup {
  groupName: string;
  rooms: Room[];
}

export const $filter = (opt: Room[], value: string): Room[] => {
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
    private stateService: StateService,
    private readonly nodeService: NodeService,
    private readonly fb: FormBuilder,
    private readonly translateService: TranslateService
  ) {
    this.stateGroups = [];
  }

  @Output() public setLocation = new EventEmitter<LocationNode>();

  public locations: GuideMapFeaturePoint[];

  public stateForm: FormGroup = this.fb.group({
    stateGroup: '338',
  });

  public stateGroups: StateGroup[];

  public stateGroupOptions: Observable<StateGroup[]>;

  public ngOnInit(): void {
    this.nodeService.getRoomsNodes().subscribe((data) => {
      this.locations = data;
      this.stateGroups.push({
        groupName: this.translateService.instant('UI.ROOM_GROUPS.CLASSROOMS'),
        rooms: data
          .filter(
            (item) =>
              item.properties.category === GuideMapFeaturePointCategory.room
          )
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
    this.stateService.endpoint = null;
  }

  public findLocation(): void {
    const foundLocation = this.locations.find((roomNode) => {
      return this.stateGroupControl.value === roomNode.properties.name;
    });

    this.stateService.endpoint = (foundLocation.properties as unknown) as GuideMapRoomProperties;
  }

  private _filterGroup(value: string): StateGroup[] {
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
