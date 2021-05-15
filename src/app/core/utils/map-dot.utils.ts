import { MapStairsFloorSwitcher } from '../enums';
import { GuideMapFeature } from '../models';

function getArrowDirection(isUpperFloor: boolean): MapStairsFloorSwitcher {
  return isUpperFloor
    ? MapStairsFloorSwitcher.ArrowUp
    : MapStairsFloorSwitcher.ArrowDown;
}

function getPrevStairsArrowDirection(
  fullPathProperties: GuideMapFeature[],
  userLocationId: number,
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
  endPointId: number,
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
};
