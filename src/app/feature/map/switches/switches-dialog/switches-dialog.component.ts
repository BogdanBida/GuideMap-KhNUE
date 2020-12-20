import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-switches-dialog',
  templateUrl: './switches-dialog.component.html',
  styleUrls: ['./switches-dialog.component.scss'],
})
export class SwitchesDialogComponent implements OnInit {
  public formGroup = this.formBuilder.group({
    enterexit: [false],
    wc: [false],
    classrooms: [false],
    stairs: [false],
  });

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {}

  public submit(): void {
    console.log(this.formGroup.value);
  }

  public reset(): void {
    // * this.formGroup.reset() ---> all keys become null (but not false as expected)
    this.formGroup.patchValue(
      Object.assign(
        {},
        ...Object.keys(this.formGroup.value).map((key) => {
          return { [key]: false };
        })
      )
    );
  }
}
