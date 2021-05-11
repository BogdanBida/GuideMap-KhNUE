import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { filterSearchValue } from 'src/app/core/utils';
import { environment } from 'src/environments/environment';
import { GuideMapFeaturePoint } from '../../../../core/models';
import { IOptionGroup } from '../../interfaces';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
})
export class SearchBarComponent implements OnInit {
  constructor(private readonly _formBuilder: FormBuilder) {}

  @Input() svgIconUrl: string;

  @Input() labelText: string;

  @Input() optionGroups: IOptionGroup[];

  @Output() selectData = new EventEmitter<string>();

  public readonly searchIconPath = environment.spriteIconsPath + 'search';

  public locations: GuideMapFeaturePoint[];

  public formGroup = this._formBuilder.group({
    value: '',
  });

  public formGroupValues: Observable<IOptionGroup[]>;

  public ngOnInit(): void {
    this.formGroupValues = this._formGroupControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterGroup(value))
    );
  }

  public findLocation(): void {
    this.selectData.emit(this._formGroupControl.value);
  }

  private _filterGroup(value: string): IOptionGroup[] {
    if (value) {
      return this.optionGroups
        .map((group) => ({
          groupName: group.groupName,
          values: filterSearchValue(group.values, value),
        }))
        .filter((group) => group.values.length > 0);
    }

    return this.optionGroups;
  }

  private get _formGroupControl(): AbstractControl {
    return this.formGroup.get('value');
  }
}
