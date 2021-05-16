import { Component, EventEmitter, Input, Output } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'gmp-zoom-button',
  templateUrl: './zoom-button.component.html',
  styleUrls: ['./zoom-button.component.scss'],
})
export class ZoomButtonComponent {
  @Input() public iconName: string;

  @Input() public isDisabled = false;

  @Output() public clickEmitter = new EventEmitter<void>();

  public readonly spriteIconsUrl = environment.spriteIconsPath;

  public emitClick(): void {
    this.clickEmitter.emit();
  }
}
