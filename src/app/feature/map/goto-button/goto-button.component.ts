import { Component, EventEmitter, Output } from '@angular/core';
import { StateService } from './../../../core/services/state.service';

@Component({
  selector: 'app-goto-button',
  templateUrl: './goto-button.component.html',
  styleUrls: ['./goto-button.component.scss']
})
export class GotoButtonComponent {

  @Output() goto = new EventEmitter<number>();

  constructor(public stateServive: StateService) { }
}
