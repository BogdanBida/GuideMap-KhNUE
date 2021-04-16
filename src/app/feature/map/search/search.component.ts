import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { LocationNode, RoomNode } from '../../../core/models';
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
  return opt.filter(item => item.viewValue.toLowerCase().indexOf(filterValue) === 0);
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public locations: RoomNode[];

  @Output() setLocation = new EventEmitter<LocationNode>();

  public stateForm: FormGroup = this.fb.group({
    stateGroup: '',
  });

  public stateGroups: StateGroup[];

  stateGroupOptions: Observable<StateGroup[]>;

  constructor(
    private stateService: StateService,
    private readonly nodeService: NodeService,
    private fb: FormBuilder,
    private translateService: TranslateService
  ) {
    this.stateGroups = [];
  }

  ngOnInit(): void {
    this.nodeService.getRoomsNodes().subscribe((data) => {
      this.locations = data;
      this.stateGroups.push({
        groupName: this.translateService.instant('UI.ROOM_GROUPS.CLASSROOMS'),
        rooms: data.map((v, i) => {
          return {
            value: String(v.id),
            viewValue: v.name,
          };
        })
      });
    });

    this.stateGroupOptions = this.stateForm.get('stateGroup').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );
  }

  public clear(): void {
    this.stateService.endpoint = null;
  }

  public findLocation(): void {
    this.stateService.endpoint = this.locations.find((v) => {
      return this.stateForm.get('stateGroup').value === v.name;
    });
  }

  private _filterGroup(value: string): StateGroup[] {
    if (value) {
      return this.stateGroups
        .map(group => ({
          groupName: group.groupName,
          rooms: $filter(group.rooms, value)
        }))
        .filter(group => group.rooms.length > 0);
    }
    return this.stateGroups;
  }
}
