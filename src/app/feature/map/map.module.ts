import { ZoomControlsComponent } from './zoom-controls/zoom-controls.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { SharedModule } from './../../shared/shared.module';
import { CanvaComponent } from './canva/canva.component';
import { FloorSwitcherComponent } from './floor-switcher/floor-switcher.component';
import { GotoButtonComponent } from './goto-button/goto-button.component';
import { InfoDialogComponent } from './info-dialog/info-dialog.component';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { SearchComponent } from './search/search.component';
import { SettingsDialogComponent } from './settings/settings-dialog/settings-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { WhereaboutsComponent } from './whereabouts/whereabouts.component';

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
    SettingsComponent,
    CanvaComponent,
    FloorSwitcherComponent,
    GotoButtonComponent,
    WhereaboutsComponent,
    SettingsDialogComponent,
    InfoDialogComponent,
    ZoomControlsComponent,
  ],
  providers: [{ provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { floatLabel: 'always' } }]
})
export class MapModule { }
