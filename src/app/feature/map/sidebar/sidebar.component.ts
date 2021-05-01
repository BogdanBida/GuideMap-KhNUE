import { StateService } from './../../../core/services/state.service';
import { FormBuilder } from '@angular/forms';
import { SidebarService } from './../../../core/services/sidebar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { NodeService } from 'src/app/core/services';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  constructor(
    public sidebarService: SidebarService,
    private stateService: StateService,
    private readonly _nodeService: NodeService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  public readonly qrCodesProperties$ = this._nodeService.qrCodesProperties$;

  public set value(val: boolean) {
    this.sidebarService.isOpen.next(val);
  }
  public get value(): boolean {
    return this.sidebarService.isOpen.value;
  }
  public isOpen: boolean = this.value;

  public form = this.formBuilder.group({
    location: [''],
  });
  public subscriptions$: Subscription[] = [];

  ngOnInit(): void {
    const valChangesSubs = this.form.valueChanges.subscribe(() => {
      const nodeid = this.form.get('location').value;
      this.router.navigate([], { queryParams: { nodeid } });
    });
    this.subscriptions$.push(
      valChangesSubs,
      this.stateService
        .getUserLocationBehaviorSubject()
        .subscribe(this.closeSidebar.bind(this)),
      this.stateService
        .getEndpointBehaviorSubject()
        .subscribe(this.closeSidebar.bind(this)),
      this.sidebarService.isOpen.asObservable().subscribe((val: boolean) => {
        this.isOpen = val;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach((s) => s.unsubscribe());
  }

  private closeSidebar(): void {
    this.sidebarService.isOpen.getValue() &&
      this.sidebarService.isOpen.next(false);
  }
}
