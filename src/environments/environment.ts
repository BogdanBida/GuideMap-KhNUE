import { Lang } from './../app/core/enums/lang.enum';

export const environment = {
  production: false,
  defaultFloor: 2,
  defaultLang: Lang.UA,
  spriteIconsPath: 'assets/icons/sprite.svg#',
  url: 'http://localhost:4200/',
  map: {
    mapWidth: 3500,
    mapHeight: 2550,
  },
};
