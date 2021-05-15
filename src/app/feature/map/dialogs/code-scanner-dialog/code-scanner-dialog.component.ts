import { Component, ElementRef, ViewChild } from '@angular/core';
import { BarcodeFormat } from '@zxing/library';

const SCAN_AREA_SIZE_FACTOR = 0.5;

// TODO: Refactored this component, add error handlers
@Component({
  selector: 'app-code-scanner-dialog',
  templateUrl: './code-scanner-dialog.component.html',
  styleUrls: ['./code-scanner-dialog.component.scss'],
})
export class CodeScannerDialogComponent {
  @ViewChild('scannerWrapper')
  public scannerWrapper: ElementRef;

  public cameraIsFound = false;

  public errorMessage: string;

  public readonly allowedFormats = [BarcodeFormat.QR_CODE];

  public onCodeResult(value: string): string {
    return value;
  }

  public camerasFoundHandler(): void {
    this.cameraIsFound = true;
  }

  public camerasNotFoundHandler(event: any): void {
    // todo: add handler logic
    console.log(event);
    this.errorMessage = event;
  }

  public scanErrorHandler(event: any): void {
    console.log(event);
  }

  public get sizeOfScanArea(): string {
    if (!(this.scannerWrapper && this.scannerWrapper.nativeElement)) {
      return 'auto';
    }

    const element = this.scannerWrapper.nativeElement;
    const size = Math.min(element.offsetWidth, element.offsetHeight);

    return SCAN_AREA_SIZE_FACTOR * size + 'px';
  }
}
