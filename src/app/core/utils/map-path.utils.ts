import { uniq } from 'lodash-es';
import {
  GuideMapFeature,
  GuideMapFeaturePoint,
  GuideMapSimpleRoute,
} from '../models';

function getUniquePathIds(fullPath: GuideMapSimpleRoute[]): number[] {
  const fullPathIds = fullPath.reduce(
    (acc, { start, end }) => [...acc, start, end],
    [] as number[]
  );
  const uniqueIds = uniq(fullPathIds);

  return uniqueIds;
}

function getPathProperties(
  uniqPathIds: number[],
  points: GuideMapFeaturePoint[]
): GuideMapFeature[] {
  return uniqPathIds.map((id) => {
    return points.find(({ properties }) => properties.id === id).properties;
  });
}

export const MapPathUtils = {
  getUniquePathIds,
  getPathProperties,
};
