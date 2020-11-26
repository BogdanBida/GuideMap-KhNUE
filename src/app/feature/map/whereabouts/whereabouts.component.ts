import { LocationNode } from '../../../shared/models/location-node';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-whereabouts',
  templateUrl: './whereabouts.component.html',
  styleUrls: ['./whereabouts.component.scss']
})
export class WhereaboutsComponent {

  @Output() setLocation = new EventEmitter<LocationNode>();

  constructor() { }

  public scanLocation(): void {
    this.setLocation.emit(
      {
        x: 305,
        y: 890
      }
    );
  }

}
