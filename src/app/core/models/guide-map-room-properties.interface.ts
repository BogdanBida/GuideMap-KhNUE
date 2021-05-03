import { GuideMapBaseProperties } from './guide-map-base-properties.interface';
import {GuideMapCorridor} from "./guide-map-corridor.interface";

export interface GuideMapRoomProperties extends GuideMapBaseProperties {
  readonly x: number;
  readonly y: number;
  readonly corridor: number;
  readonly corridors: GuideMapCorridor[];
}
