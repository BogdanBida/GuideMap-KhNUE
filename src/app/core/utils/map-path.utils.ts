import { uniq } from 'lodash-es';
import {
  GuideMapFeature,
  GuideMapFeaturePoint,
  GuideMapSimpleRoute,
} from '../models';

function getUniquePathIds(fullPath: GuideMapSimpleRoute[]): string[] {
  const fullPathIds = fullPath.reduce(
    (acc, { start, end }) => [...acc, start, end],
    [] as string[]
  );
  const uniqueIds = uniq(fullPathIds) as string[];

  return uniqueIds;
}

function getPathProperties(
  uniqPathIds: string[],
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
