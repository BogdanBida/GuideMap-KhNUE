import { GuideMapCorridorProperties } from "./guide-map-corridor-properties.interface";
import { GuideMapRoomProperties } from "./guide-map-room-properties.interface";

export interface GuideMapFeaturePoint {
  properties: GuideMapCorridorProperties | GuideMapRoomProperties;
}
