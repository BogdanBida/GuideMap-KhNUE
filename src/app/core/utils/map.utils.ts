import { GraphVertex } from 'src/app/shared/utils';
import { GuideMapFeaturePointCategory } from '../enums';
import { GuideMapFeaturePoint } from '../models';

function filterByCategories<T>(
  dataSet: Record<string, any>[],
  ...categories: GuideMapFeaturePointCategory[]
): T[] {
  return dataSet.filter((featurePoint) => {
    return categories.includes(featurePoint.properties.category);
  }) as T[];
}

function getVertexes(points: GuideMapFeaturePoint[]): GraphVertex[] {
  const vertexes: GraphVertex[] = [];

  points.forEach((point) => {
    const corridorVertex = new GraphVertex(point.properties.id);

    vertexes.push(corridorVertex);
  });

  return vertexes;
}

export const MapUtils = {
  filterByCategories,
  getVertexes,
};
