import { GmpQueryParamName } from '../enums/gmp-query-param-name.enum';

export interface GmpQueryParams {
  [GmpQueryParamName.QrNodeId]?: string;
  [GmpQueryParamName.RoomId]?: string;
}
