import { GmpQueryParamName } from '../enums/gmp-query-param-name.enum';

export interface GmpQueryParams {
  [GmpQueryParamName.From]?: string;
  [GmpQueryParamName.To]?: string;
}
