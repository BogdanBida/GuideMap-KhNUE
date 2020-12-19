import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NodeService } from './../../../core/services/node.service';
import { LocationNode } from './../../../shared/models/location-node';
import { RoomNode } from './../../../shared/models/room-node';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  public inputText: string;
  public locations: RoomNode[];

  @Output() setLocation = new EventEmitter<LocationNode>();

  roomControl = new FormControl();
  public roomGroups = [
    {
      name: 'WC',
      disabled: true,
      room: [
        { value: 'undefined', viewValue: 'M2 - man' },
        { value: 'undefined', viewValue: 'M2 - women' },
      ],
    },
    {
      name: 'Other',
      disabled: true,
      room: [{ value: 'undefined', viewValue: 'Auditorium' }],
    },
  ];

  constructor(private readonly nodeService: NodeService) {}

  ngOnInit(): void {
    this.nodeService.getRoomsNodes().subscribe((data) => {
      this.locations = data;
      this.roomGroups.push({
        name: 'Classroom',
        disabled: !data.length,
        room: data.map((v, i) => {
          return {
            value: String(i),
            viewValue: v.name,
          };
        }),
      });
    });
  }

  public clear(): void {
    this.inputText = '';
  }

  public find(): void {
    console.log(this.inputText);
  }

  public findLocation(): void {
    if (!this.roomControl.value) {
      return;
    }
    this.setLocation.emit(this.locations[this.roomControl.value]);
  }
}
