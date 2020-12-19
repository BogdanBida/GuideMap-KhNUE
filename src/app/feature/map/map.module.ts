import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { CanvaComponent } from './canva/canva.component';
import { FloorSwitcherComponent } from './floor-switcher/floor-switcher.component';
import { GotoButtonComponent } from './goto-button/goto-button.component';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './map.component';
import { SearchComponent } from './search/search.component';
import { SwitchesComponent } from './switches/switches.component';
import { WhereaboutsComponent } from './whereabouts/whereabouts.component';
import { MatSelectModule } from '@angular/material/select';
import { SwitchesDialogComponent } from './switches/switches-dialog/switches-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  imports: [
    CommonModule,
    MapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ZXingScannerModule,
    MatSelectModule,
    MatDialogModule,
  ],
  declarations: [
    MapComponent,
    SearchComponent,
    SwitchesComponent,
    CanvaComponent,
    FloorSwitcherComponent,
    GotoButtonComponent,
    WhereaboutsComponent,
    SwitchesDialogComponent,
  ],
})
export class MapModule {}
