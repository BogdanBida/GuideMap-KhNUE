import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: ['']
})
export class AppComponent {
  title = 'guidemap';

  constructor(translate: TranslateService) {
    const defaultLang = translate.getBrowserLang() || environment.defaultLang;
    translate.setDefaultLang(defaultLang);
    translate.use(defaultLang);
  }
}
