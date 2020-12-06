import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-goto-button',
  templateUrl: './goto-button.component.html',
  styleUrls: ['./goto-button.component.scss']
})
export class GotoButtonComponent {

  @Input() isLocationExist: boolean;
  @Input() isEndpointExist: boolean;
  @Output() goto = new EventEmitter<boolean>();

  constructor() { }
}
