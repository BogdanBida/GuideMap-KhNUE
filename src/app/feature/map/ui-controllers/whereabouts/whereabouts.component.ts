/* eslint-disable @typescript-eslint/naming-convention */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import {
  GuideMapFeaturePoint,
  GuideMapRoomProperties,
  LocationNode,
} from '../../../../core/models';
import { NodeService, StateService } from '../../../../core/services';

@Component({
  selector: 'app-whereabouts',
  templateUrl: './whereabouts.component.html',
  styleUrls: ['./whereabouts.component.scss'],
})
export class WhereaboutsComponent implements OnInit {
  constructor(
    private stateService: StateService,
    private readonly router: Router,
    private readonly acivateRoute: ActivatedRoute,
    private readonly nodeService: NodeService
  ) {}

  @Output() public setLocation = new EventEmitter<LocationNode>();

  public locNodes: GuideMapFeaturePoint[];

  public isOpen = false;

  public ngOnInit(): void {
    combineLatest([
      this.acivateRoute.queryParams,
      this.nodeService.getQrCodes(),
    ]).subscribe(([params, data]) => {
      const nodeId = parseFloat(params.nodeid);
      const userLocation = (data.find(
        ({ properties }) => properties.id === nodeId
      ).properties as unknown) as GuideMapRoomProperties;

      this.locNodes = data;
      // this.stateService.userLocation = userLocation;

      this.stateService.userLocation = ({
        id: 0,
        name: '201',
        category: 'room',
        x: 2070,
        y: 1825,
        corridor: 2,
        corridors: [
          {
            endRoom: 1,
            corridorTracks: [2, 3],
          },
        ],
      } as unknown) as GuideMapRoomProperties;
    });
  }

  public onCodeResult(resultString: string): void {
    const nodeid = resultString.split('?')[1].split('=')[1];

    this.router.navigate([], { queryParams: { nodeid } });
    this.isOpen = false;
  }
}
