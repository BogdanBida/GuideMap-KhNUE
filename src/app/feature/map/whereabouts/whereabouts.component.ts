import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private readonly router: Router,
    private readonly acivateRoute: ActivatedRoute
  ) {
    this.locNodes = [ // todo: moved to service (read this data from assets/json_data/mc_1.json)
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
    ];
  }

  public ngOnInit(): void {
    this.acivateRoute.queryParams.subscribe(params => {
      const nodeId = params.nodeid;
      this.setLocation.emit(this.locNodes[nodeId]);
    });
  }

  onCodeResult(resultString: string): void {
    const nodeid = resultString.split('?')[1].split('=')[1];
    this.router.navigate([], { queryParams: { nodeid } });
    setTimeout(() => { // todo: remake scaning delay
      this.isOpen = false;
    }, 250);
  }
}
