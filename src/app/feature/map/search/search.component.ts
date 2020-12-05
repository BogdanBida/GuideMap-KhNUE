import { Component, EventEmitter, Output } from '@angular/core';
import { LocationNode } from './../../../shared/models/location-node';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {

  public inputText: string;
  @Output() setLocation = new EventEmitter<LocationNode>();

  constructor() { }

  public clear(): void {
    this.inputText = '';
  }

  public find(): void {
    console.log(this.inputText);
  }

  public findLocation(): void {
    this.setLocation.emit(
      {
        x: 325,
        y: 500
      }
    );
  }

}
