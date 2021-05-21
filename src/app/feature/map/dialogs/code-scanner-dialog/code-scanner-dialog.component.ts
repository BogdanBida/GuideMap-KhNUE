import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { GMPRouterService } from 'src/app/core/services';
import {
  ALLOWED_SCANNER_FORMATS,
  ERROR_MESSAGE_TIMEOUT_MS,
  SCAN_AREA_SIZE_FACTOR,
} from 'src/app/shared/constants';

@UntilDestroy()
@Component({
  selector: 'app-code-scanner-dialog',
  templateUrl: './code-scanner-dialog.component.html',
  styleUrls: ['./code-scanner-dialog.component.scss'],
})
export class CodeScannerDialogComponent {
  constructor(
    private readonly _gmpRouterService: GMPRouterService,
    private readonly _dialogRef: MatDialogRef<CodeScannerDialogComponent>
  ) {}

  @ViewChild('scannerWrapper')
  public scannerWrapper: ElementRef;

  public cameraIsFound = false;

  public errorMessage: string;

  public readonly allowedFormats = ALLOWED_SCANNER_FORMATS;

  public onCodeResult(value: string): void {
    this._gmpRouterService
      .setPointsFromUrl$(value)
      .pipe(untilDestroyed(this))
      .subscribe({
        complete: () => {
          this._dialogRef.close();
        },
        error: (message) => {
          this.errorMessage = message;
          setTimeout(() => {
            this.errorMessage = null;
          }, ERROR_MESSAGE_TIMEOUT_MS);
        },
      });
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
