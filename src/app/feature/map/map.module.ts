import { FloorSwitcherComponent } from './floor-switcher/floor-switcher.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';
import { SwitchesComponent } from './switches/switches.component';
import { CanvaComponent } from './canva/canva.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { WhereaboutsComponent } from './whereabouts/whereabouts.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

@NgModule({
  imports: [
    CommonModule,
    MapRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ZXingScannerModule,
  ],
  declarations: [
    MapComponent,
    SearchComponent,
    SwitchesComponent,
    CanvaComponent,
    FloorSwitcherComponent,
    WhereaboutsComponent,
  ],
})
export class MapModule {}
