import {
  ENDPOINT_COLOR,
  STAIRS_ENDPOINT_COLOR,
  USER_LOCATION_COLOR,
} from 'src/app/shared/constants';
import { GuideMapFeaturePointCategory } from '../enums';

function getPointColor(
  category: GuideMapFeaturePointCategory,
  isEndpoint: boolean
): string {
  if (category === GuideMapFeaturePointCategory.Stairs) {
    return STAIRS_ENDPOINT_COLOR;
  }

  if (isEndpoint) {
    return ENDPOINT_COLOR;
  }

  return USER_LOCATION_COLOR;
}

export const MapPointUtils = {
  getPointColor,
};
