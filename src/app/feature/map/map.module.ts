import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import {
  MatFormFieldModule,
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SharedModule } from './../../shared/shared.module';
import { CanvaComponent } from './canva/canva.component';
import { CodeScannerDialogComponent } from './dialogs/code-scanner-dialog/code-scanner-dialog.component';
import { ManualDialogComponent } from './dialogs/manual-dialog/manual-dialog.component';
import { SettingsDialogComponent } from './dialogs/settings-dialog/settings-dialog.component';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { SearchBarTogglerComponent } from './search/search-bar-toggler/search-bar-toggler.component';
import { SearchBarComponent } from './search/search-bar/search-bar.component';
import { SearchComponent } from './search/search.component';
import { SettingsComponent } from './settings/settings.component';
import { FloorSwitcherComponent, WhereaboutsComponent } from './ui-controllers';
import { ManualButtonComponent } from './ui-controllers/manual-button/manual-button.component';
import { ZoomButtonComponent } from './ui-controllers/zoom-button/zoom-button.component';
import { ZoomControlsComponent } from './ui-controllers/zoom-controls/zoom-controls.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    MatSelectModule,
    MatDialogModule,
    MatCheckboxModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule,
    MatRippleModule,
  ],
  declarations: [
    MapComponent,
    SearchComponent,
    SearchBarComponent,
    SettingsComponent,
    CanvaComponent,
    FloorSwitcherComponent,
    WhereaboutsComponent,
    SettingsDialogComponent,
    ManualButtonComponent,
    ManualDialogComponent,
    CodeScannerDialogComponent,
    ZoomControlsComponent,
    ZoomButtonComponent,
    SearchBarTogglerComponent,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { floatLabel: 'always' },
    },
  ],
})
export class MapModule {}
