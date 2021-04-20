import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from './../environments/environment';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
  styles: ['']
})
export class AppComponent {
  title = 'guidemap';

  @HostListener('wheel', ['$event'])
  onWheel(event: MouseEvent): void {
    if (event.ctrlKey === true) {
      console.log('app wheel + ctrl');
      event.preventDefault();
      event.stopPropagation();
    }
  }

  constructor(translate: TranslateService) {
    const defaultLang = translate.getBrowserLang() || environment.defaultLang;
    translate.setDefaultLang(defaultLang);
    translate.use(defaultLang);
  }
}
