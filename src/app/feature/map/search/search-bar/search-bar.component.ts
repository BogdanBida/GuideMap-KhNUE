/* eslint-disable @typescript-eslint/naming-convention */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { GuideMapFeaturePoint } from '../../../../core/models';

// TODO: Moved interfaces to another place
export interface IOption {
  value: string;
  viewValue: string;
}

export interface IOptionGroup {
  groupName: string;
  rooms: IOption[];
}

export const $filter = (opt: IOption[], value: string): IOption[] => {
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
  constructor(private readonly fb: FormBuilder) {}

  @Input() svgIconUrl: string;
  @Input() labelText: string;
  @Input() optionGroups: IOptionGroup[];
  @Output() selectData = new EventEmitter<string>();

  public locations: GuideMapFeaturePoint[];

  public formGroup: FormGroup = this.fb.group({
    value: '',
  });

  public stateGroupOptions: Observable<IOptionGroup[]>;

  public ngOnInit(): void {
    this.stateGroupOptions = this.formGroupControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value))
    );
  }

  public findLocation(): void {
    this.selectData.emit(this.formGroupControl.value);
  }

  private _filterGroup(value: string): IOptionGroup[] {
    if (value) {
      return this.optionGroups
        .map((group) => ({
          groupName: group.groupName,
          rooms: $filter(group.rooms, value),
        }))
        .filter((group) => group.rooms.length > 0);
    }

    return this.optionGroups;
  }

  private get formGroupControl(): AbstractControl {
    return this.formGroup.get('value');
  }
}
