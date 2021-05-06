import { GuideMapBaseProperties } from './guide-map-base-properties.interface';

export interface GuideMapRoomProperties extends GuideMapBaseProperties {
  readonly x: number;
  readonly y: number;
  readonly corridor: number;
}
