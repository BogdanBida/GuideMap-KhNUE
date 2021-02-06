import { Component, ElementRef, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { StateService } from './../../../core/services/state.service';

@Component({
  selector: 'app-goto-button',
  templateUrl: './goto-button.component.html',
  styleUrls: ['./goto-button.component.scss']
})
export class GotoButtonComponent implements OnInit {

  public deg: number;

  constructor(public stateService: StateService, private elementRef: ElementRef) { }

  ngOnInit(): void {
    this.stateService.gotoClickEvent = fromEvent(this.elementRef.nativeElement, 'click');
  }
}
