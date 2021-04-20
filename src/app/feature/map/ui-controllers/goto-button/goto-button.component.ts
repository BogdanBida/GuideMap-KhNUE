import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { fromEvent, of, combineLatest } from 'rxjs';
import { StateService } from '../../../../core/services';

@Component({
  selector: 'app-goto-button',
  templateUrl: './goto-button.component.html',
  styleUrls: ['./goto-button.component.scss']
})
export class GotoButtonComponent implements OnInit {

  constructor(
    public stateService: StateService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) { }

  ngOnInit(): void {
    this.stateService.gotoClickEvent = fromEvent(this.elementRef.nativeElement, 'click');
    combineLatest([ // todo: add unsubsribing
      this.stateService.getEndpointBehaviorSubject(),
      this.stateService.getUserLocationBehaviorSubject()
    ]).subscribe(([endpoint, userloc]) => {
      !(userloc && endpoint) ?
        this.renderer.addClass(this.elementRef.nativeElement, 'disabled')
        : this.renderer.removeClass(this.elementRef.nativeElement, 'disabled');
    });
  }
}
