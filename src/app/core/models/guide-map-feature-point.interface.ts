import { GuideMapCorridorProperties } from './guide-map-corridor-properties.interface';
import { GuideMapRoomProperties } from './guide-map-room-properties.interface';

export interface GuideMapFeaturePoint<
  T = GuideMapCorridorProperties | GuideMapRoomProperties
> {
  properties: T;
}

export type GuideMapFeature =
  | GuideMapCorridorProperties
  | GuideMapRoomProperties;

export type GuideMapFeaturePointCorridor =
  GuideMapFeaturePoint<GuideMapCorridorProperties>;

export type GuideMapFeaturePointRoom =
  GuideMapFeaturePoint<GuideMapRoomProperties>;
