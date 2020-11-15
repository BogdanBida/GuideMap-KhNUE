import { Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  public floor: number;

  constructor() { this.floor = 1}

  ngOnInit() {
  }

  public changeFloor(n: number): void {
    if (n > 0 && this.floor < 9) this.floor += n;
    if (n < 0 && this.floor > 1) this.floor += n;
  }

}
