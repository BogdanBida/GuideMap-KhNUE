import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Lang } from '../../../../core/enums/lang.enum';

@Component({
  selector: 'app-settings-dialog',
  templateUrl: './settings-dialog.component.html',
  styleUrls: ['./settings-dialog.component.scss'],
})
export class SettingsDialogComponent implements OnInit, OnDestroy {
  private readonly selectedLang = this.translateService.currentLang;
  public langFG = this.formBuilder.group({
    lang: [this.selectedLang]
  });
  public formSubscription: Subscription;

  public languages = [
    { name: 'Українська', value: Lang.UA },
    { name: 'Русский', value: Lang.RU },
    { name: 'English', value: Lang.EN },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    this.formSubscription = this.langFG.valueChanges.subscribe(() => {
      this.translateService.use(this.langFG.get('lang').value);
    });
  }

  ngOnDestroy(): void {
  }

  public reset(): void {
    this.langFG.patchValue({ lang: this.selectedLang });
  }
}
