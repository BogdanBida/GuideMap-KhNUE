import { GmpQueryParamName } from '../enums/gmp-query-param-name.enum';

export interface GmpQueryParams {
  readonly [GmpQueryParamName.QrNodeId]?: string;
  readonly [GmpQueryParamName.RoomId]?: string;
}
