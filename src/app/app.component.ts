import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styles: [''],
})
export class AppComponent {
  constructor(translate: TranslateService) {
    const defaultLang = translate.getBrowserLang() || environment.defaultLang;

    translate.setDefaultLang(defaultLang);
    translate.use(defaultLang);
  }

  public title = 'guidemap';
}
