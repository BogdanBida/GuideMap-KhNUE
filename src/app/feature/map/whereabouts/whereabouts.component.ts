import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';

import { LocationNode } from 'src/app/shared/models';

@Component({
  selector: 'app-whereabouts',
  templateUrl: './whereabouts.component.html',
  styleUrls: ['./whereabouts.component.scss'],
})
export class WhereaboutsComponent {
  @Output() setLocation = new EventEmitter<LocationNode>();

  public isOpen = false;
  constructor(private readonly _router: Router) {}

  public scanLocation(): void {
    this.isOpen = true;
    // this.setLocation.emit({
    //   x: 305,
    //   y: 890,
    // });
  }

  onCodeResult(resultString: string): void {
    this._router.navigate([], { queryParams: { nodeId: resultString } });
    this.isOpen = false;
  }
}
