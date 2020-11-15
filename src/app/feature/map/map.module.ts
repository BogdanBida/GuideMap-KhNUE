import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { MapComponent } from './map.component';
import { MapRoutingModule } from './map-routing.module';
import { SwitchesComponent } from './switches/switches.component';
import { CanvaComponent } from './canva/canva.component';
import { BuildingService } from 'src/app/core/services/building.service';

@NgModule({
  imports: [
    CommonModule,
    MapRoutingModule,
  ],
  declarations: [MapComponent, SearchComponent, SwitchesComponent, CanvaComponent]
})
export class MapModule { }
