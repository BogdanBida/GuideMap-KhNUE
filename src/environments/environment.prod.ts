import { Lang } from './../app/core/enums/lang.enum';

export const environment = {
  production: true,
  defaultFloor: 2,
  defaultLang: Lang.UA,
  defaultZoomFactor: 1,
  spriteIconsPath: 'assets/icons/sprite.svg#',
  url: 'https://guidemap-test.web.app/',
  map: {
    mapWidth: 2975,
    mapHeight: 2220,
  },
};
