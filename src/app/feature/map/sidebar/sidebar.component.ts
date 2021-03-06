import { FormBuilder } from '@angular/forms';
import { SidebarService } from './../../../core/services/sidebar.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public set value(val: boolean) {
    this.sidebarService.isOpen.next(val);
  }
  public get value(): boolean {
    return this.sidebarService.isOpen.value;
  }

  public form = this.formBuilder.group({
    location: [''],
  });
  public subscriptions: Subscription[];

  constructor(
    public sidebarService: SidebarService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.form.valueChanges.subscribe(() => {
      const nodeid = this.form.get('location').value;
      this.router.navigate([], { queryParams: { nodeid } });
      this.sidebarService.isOpen.next(false);
    });
  }
}
