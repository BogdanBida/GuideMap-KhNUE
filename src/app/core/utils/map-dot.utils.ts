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

function getFloorSwitcherDirection(
  fullPathProperties: GuideMapFeature[],
  stairFloorSwitcherId: string
): MapStairsFloorSwitcher {
  const stairFloorSwitcherIndex = fullPathProperties.findIndex(
    (stairs) => stairFloorSwitcherId === stairs.id
  );

  const isPrevNeighborStairs = checkIsStairs(
    fullPathProperties[stairFloorSwitcherIndex - 1]?.category
  );
  const isNextNeighborStairs = checkIsStairs(
    fullPathProperties[stairFloorSwitcherIndex + 1]?.category
  );

  if (isPrevNeighborStairs) {
    const isUpperFloor =
      fullPathProperties[stairFloorSwitcherIndex - 1]?.floor >
      fullPathProperties[stairFloorSwitcherIndex + 1]?.floor;

    return getArrowDirection(isUpperFloor);
  }

  if (isNextNeighborStairs) {
    const isDownFloor =
      fullPathProperties[stairFloorSwitcherIndex - 1]?.floor <
      fullPathProperties[stairFloorSwitcherIndex + 1]?.floor;

    return getArrowDirection(isDownFloor);
  }

  return null;
}

export const MapDotUtils = {
  getNextStairsArrowDirection,
  getPrevStairsArrowDirection,
  checkIsStairs,
  getFloorSwitcherDirection,
};
