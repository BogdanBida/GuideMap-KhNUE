import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { LocationNode } from 'src/app/shared/models';
import { NodeService } from './../../../core/services/node.service';

@Component({
  selector: 'app-whereabouts',
  templateUrl: './whereabouts.component.html',
  styleUrls: ['./whereabouts.component.scss'],
})
export class WhereaboutsComponent implements OnInit {
  @Output() setLocation = new EventEmitter<LocationNode>();

  public locNodes: LocationNode[];

  public isOpen = false;
  constructor(
    private readonly router: Router,
    private readonly acivateRoute: ActivatedRoute,
    private readonly nodeService: NodeService
  ) {}

  public ngOnInit(): void {
    combineLatest([
      this.acivateRoute.queryParams,
      this.nodeService.getQRNodes(),
    ]).subscribe(([params, data]) => {
      const nodeId = params.nodeid;
      this.locNodes = data;
      this.setLocation.emit(this.locNodes[nodeId]);
    });
  }

  onCodeResult(resultString: string): void {
    const nodeid = resultString.split('?')[1].split('=')[1];
    this.router.navigate([], { queryParams: { nodeid } });
    this.isOpen = false;
  }
}
