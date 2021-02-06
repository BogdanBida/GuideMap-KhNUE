import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'guidemap';

  constructor(translate: TranslateService) {
    translate.setDefaultLang('ua');
    translate.use('ua');
}
}
