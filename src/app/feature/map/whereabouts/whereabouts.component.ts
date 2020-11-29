import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { LocationNode } from 'src/app/shared/models';

@Component({
  selector: 'app-whereabouts',
  templateUrl: './whereabouts.component.html',
  styleUrls: ['./whereabouts.component.scss'],
})
export class WhereaboutsComponent implements OnInit {
  @Output() setLocation = new EventEmitter<LocationNode>();

  private locNodes: LocationNode[];

  public isOpen = false;
  constructor(
    private readonly _router: Router,
    private readonly _acivateRoute: ActivatedRoute
  ) {
    this.locNodes = [
      {
        x: 305,
        y: 490
      },
      {
        x: 305,
        y: 890
      },
      {
        x: 525,
        y: 920
      },
      {
        x: 915,
        y: 920
      },
    ]
  }

  public ngOnInit(): void {
    this._acivateRoute.queryParams.subscribe(params => {
      const nodeId = params['nodeid'];
      console.log('nodeId: ' + nodeId);
      this.setLocation.emit(this.locNodes[nodeId]);
    })
  }

  public scanLocation(): void {
    this.isOpen = true;
  }

  onCodeResult(resultString: string): void {
    const nodeid = resultString.split('?')[1].split('=')[1];
    this._router.navigate([], { queryParams: { nodeid }});
    setTimeout(() => {
      this.isOpen = false;
    }, 500);
  }
}
