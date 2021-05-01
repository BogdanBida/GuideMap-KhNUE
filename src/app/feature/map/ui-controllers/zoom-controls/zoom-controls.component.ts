import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';

const MAX_ZOOM = 1;
const MIN_ZOOM = 0.25;
const ZOOM_STEP = 0.25;

@Component({
  selector: 'app-zoom-controls',
  templateUrl: './zoom-controls.component.html',
  styleUrls: ['./zoom-controls.component.scss']
})
export class ZoomControlsComponent implements OnInit {

  @Output() zoomChange = new EventEmitter<number>();

  public isMax: boolean;
  public isMin: boolean;

  public set zoomFactor(value: number) {
    this.isMax = value === MAX_ZOOM;
    this.isMin = value === MIN_ZOOM;
    if (value > MAX_ZOOM || value < MIN_ZOOM) { return; }
    this.$zoomFactor = value;
    this.zoomChange.emit(value);
  }
  public get zoomFactor(): number { return this.$zoomFactor; }
  private $zoomFactor: number;

  ngOnInit(): void {
    this.zoomFactor = environment.defaultZoomFactor;
  }

  public zoomIn(): void {
    this.zoomFactor = this.$zoomFactor + (this.$zoomFactor < MAX_ZOOM ? ZOOM_STEP : 0);
  }

  public zoomOut(): void {
    this.zoomFactor = this.$zoomFactor - (this.$zoomFactor > MIN_ZOOM ? ZOOM_STEP : 0);
  }
}
