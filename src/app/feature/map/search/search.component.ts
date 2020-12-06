import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NodeService } from './../../../core/services/node.service';
import { LocationNode } from './../../../shared/models/location-node';
import { RoomNode } from './../../../shared/models/room-node';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  public inputText: string;
  public locations: RoomNode[];

  @Output() setLocation = new EventEmitter<LocationNode>();

  constructor(
    private readonly nodeService: NodeService
  ) { }

  ngOnInit(): void {
    this.nodeService.getRoomsNodes().subscribe(data => {
      this.locations = data;
    });
  }

  public clear(): void {
    this.inputText = '';
  }

  public find(): void {
    console.log(this.inputText);
  }

  public findLocation(): void {
    this.setLocation.emit(this.locations[0]);
  }

}
