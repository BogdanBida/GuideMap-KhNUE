import { GuideMapBaseProperties } from "./guide-map-base-properties.interface";

export interface GuideMapCorridorProperties extends GuideMapBaseProperties {
  distance: number;
  x: number;
  y: number;
  endRooms: Array<number>;
  startRooms: Array<number>;
}
