import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-goto-button',
  templateUrl: './goto-button.component.html',
  styleUrls: ['./goto-button.component.scss']
})
export class GotoButtonComponent {

  @Input() isLocationExist: boolean;
  @Input() isEndpointExist: boolean;
  constructor() { }
}
