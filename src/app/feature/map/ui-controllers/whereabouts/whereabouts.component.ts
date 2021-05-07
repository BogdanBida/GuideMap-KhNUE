/* eslint-disable @typescript-eslint/naming-convention */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { GuideMapFeaturePointCategory } from 'src/app/core/enums';
import { GuideMapFeaturePoint, LocationNode } from '../../../../core/models';
import {
  MapDataProviderService,
  MapPathService,
} from '../../../../core/services';

@Component({
  selector: 'app-whereabouts',
  templateUrl: './whereabouts.component.html',
  styleUrls: ['./whereabouts.component.scss'],
})
export class WhereaboutsComponent implements OnInit {
  constructor(
    private readonly _mapPathService: MapPathService,
    private readonly router: Router,
    private readonly acivateRoute: ActivatedRoute,
    private readonly _mapDataProviderService: MapDataProviderService
  ) {}

  @Output() public setLocation = new EventEmitter<LocationNode>();

  public locNodes: GuideMapFeaturePoint[];

  public isOpen = false;

  public ngOnInit(): void {
    combineLatest([
      this.acivateRoute.queryParams,
      this._mapDataProviderService.qrCodes$,
    ]).subscribe(([, data]) => {
      // const nodeId = parseFloat(params.nodeid);
      // const userLocation = (data.find(
      //   ({ properties }) => properties.id === nodeId
      // ).properties as unknown) as GuideMapRoomProperties;

      this.locNodes = data;
      // this.stateService.userLocation = userLocation;

      this._mapPathService.startPoint$.next({
        id: 0,
        name: '201',
        category: GuideMapFeaturePointCategory.Room,
        x: 2070,
        y: 1825,
        corridor: 2,
        floor: 2,
      });

      this._mapPathService.currentUserLocationPoint$.next({
        id: 0,
        name: '201',
        category: GuideMapFeaturePointCategory.Room,
        x: 2070,
        y: 1825,
        corridor: 2,
        floor: 2,
      });
    });
  }

  public onCodeResult(resultString: string): void {
    const nodeid = resultString.split('?')[1].split('=')[1];

    this.router.navigate([], { queryParams: { nodeid } });
    this.isOpen = false;
  }
}
