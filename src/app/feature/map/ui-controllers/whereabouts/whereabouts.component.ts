import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { GuideMapFeaturePoint, LocationNode } from '../../../../core/models';
import { MapDataProviderService } from '../../../../core/services';
import { CodeScannerDialogComponent } from './../../dialogs/code-scanner-dialog/code-scanner-dialog.component';

@Component({
  selector: 'app-whereabouts',
  templateUrl: './whereabouts.component.html',
  styleUrls: ['./whereabouts.component.scss'],
})
export class WhereaboutsComponent implements OnInit {
  constructor(
    private readonly _router: Router,
    private readonly _acivateRoute: ActivatedRoute,
    private readonly _dialog: MatDialog,
    private readonly _mapDataProviderService: MapDataProviderService
  ) {}

  @Output() public setLocation = new EventEmitter<LocationNode>();

  public locNodes: GuideMapFeaturePoint[];

  public isOpen = false;

  // TODO:
  public ngOnInit(): void {
    combineLatest([
      this._acivateRoute.queryParams,
      this._mapDataProviderService.qrCodes$,
    ]).subscribe(([, data]) => {
      // const nodeId = parseFloat(params.nodeid);
      // const userLocation = (data.find(
      //   ({ properties }) => properties.id === nodeId
      // ).properties as unknown) as GuideMapRoomProperties;

      this.locNodes = data;
      // this.stateService.userLocation = userLocation;

      // this._mapPathService.startPoint$.next({
      //   id: 0,
      //   name: '201',
      //   category: GuideMapFeaturePointCategory.Room,
      //   x: 2070,
      //   y: 1825,
      //   corridor: 2,
      //   floor: 2,
      // });

      // this._mapPathService.currentUserLocationPoint$.next({
      //   id: 0,
      //   name: '201',
      //   category: GuideMapFeaturePointCategory.Room,
      //   x: 2070,
      //   y: 1825,
      //   corridor: 2,
      //   floor: 2,
      // });
    });
  }

  public onCodeResult(resultString: string): void {
    const nodeid = resultString.split('?')[1].split('=')[1];

    this._router.navigate([], { queryParams: { nodeid } });
    this.isOpen = false;
  }

  public openDialog(): void {
    this._dialog.open(CodeScannerDialogComponent, {
      panelClass: 'guidemap-dialog-window-glassmorphed',
      maxWidth: '95vw',
    });
  }
}
