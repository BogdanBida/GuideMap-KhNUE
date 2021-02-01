import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { NodeService } from './../../../core/services/node.service';
import { StateService } from './../../../core/services/state.service';
import { LocationNode } from './../../../shared/models/location-node';
import { RoomNode } from './../../../shared/models/room-node';

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
  ) {
    this.stateGroups = [];
  }

  ngOnInit(): void {

    this.nodeService.getRoomsNodes().subscribe((data) => {
      this.locations = data;
      // this.roomGroups.push({
      //   name: 'Classroom',
      //   disabled: !data.length,
      //   room: data.map((v, i) => {
      //     return {
      //       value: String(i),
      //       viewValue: v.name,
      //     };
      //   }),
      // });
      this.stateGroups.push({
        groupName: 'Classroom',
        rooms: data.map((v, i) => {
          return {
            value: String(i),
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
    // this.roomControl.setValue(null);
    this.stateService.endpoint = null;
  }

  public findLocation(): void {
    // this.roomControl.value &&
    // (this.stateService.endpoint = this.locations[this.roomControl.value]);
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
