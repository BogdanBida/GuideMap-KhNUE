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
): {
  arrowDirection: MapStairsFloorSwitcher;
  directFloor: number;
} {
  const stairFloorSwitcherIndex = fullPathProperties.findIndex(
    (stairs) => stairFloorSwitcherId === stairs.id
  );

  const prevNeighbor = fullPathProperties[stairFloorSwitcherIndex - 1];
  const nextNeighbor = fullPathProperties[stairFloorSwitcherIndex + 1];
  const prevNeighborFloor = prevNeighbor?.floor;
  const nextNeighborFloor = nextNeighbor?.floor;
  const isPrevNeighborStairs = checkIsStairs(prevNeighbor?.category);
  const isNextNeighborStairs = checkIsStairs(nextNeighbor?.category);

  if (isPrevNeighborStairs) {
    const isUpperFloor = prevNeighborFloor > nextNeighborFloor;

    return {
      arrowDirection: getArrowDirection(isUpperFloor),
      directFloor: prevNeighborFloor,
    };
  }

  if (isNextNeighborStairs) {
    const isDownFloor = prevNeighborFloor < nextNeighborFloor;

    return {
      arrowDirection: getArrowDirection(isDownFloor),
      directFloor: nextNeighborFloor,
    };
  }

  return null;
}

export const MapDotUtils = {
  getNextStairsArrowDirection,
  getPrevStairsArrowDirection,
  checkIsStairs,
  getFloorSwitcherDirection,
};
