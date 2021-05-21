import { GuideMapFeaturePointCategory, MapStairsFloorSwitcher } from '../enums';
import { GuideMapFeature } from '../models';

function getArrowDirection(isUpperFloor: boolean): MapStairsFloorSwitcher {
  return isUpperFloor
    ? MapStairsFloorSwitcher.ArrowUp
    : MapStairsFloorSwitcher.ArrowDown;
}

function checkIsStairs(category: GuideMapFeaturePointCategory): boolean {
  return category === GuideMapFeaturePointCategory.Stairs;
}

function getPrevStairsArrowDirection(
  fullPathProperties: GuideMapFeature[],
  userLocationId: string,
  currentFloor: number
): MapStairsFloorSwitcher {
  const previousPointBeforeUserInPathIndex =
    fullPathProperties.findIndex((stairs) => userLocationId === stairs.id) - 1;
  const previousFloorInPath =
    fullPathProperties[previousPointBeforeUserInPathIndex].floor;
  const isPreviousPointOnUpperFloor = previousFloorInPath > currentFloor;

  return getArrowDirection(isPreviousPointOnUpperFloor);
}

function getNextStairsArrowDirection(
  fullPathProperties: GuideMapFeature[],
  endPointId: string,
  currentFloor: number
): MapStairsFloorSwitcher {
  const nextPointBeforeUserInPathIndex =
    fullPathProperties.findIndex((stairs) => endPointId === stairs.id) + 1;
  const nextFloorInPath =
    fullPathProperties[nextPointBeforeUserInPathIndex].floor;
  const isNextPointOnUpperFloor = nextFloorInPath > currentFloor;

  return getArrowDirection(isNextPointOnUpperFloor);
}

export const MapDotUtils = {
  getNextStairsArrowDirection,
  getPrevStairsArrowDirection,
  checkIsStairs,
};
