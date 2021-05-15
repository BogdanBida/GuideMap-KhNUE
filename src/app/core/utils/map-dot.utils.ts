import { MapStairsFloorSwitcher } from '../enums';
import { GuideMapCorridorProperties, GuideMapRoomProperties } from '../models';

function getPrevStairsArrowDirection(
  fullPathProperties: (GuideMapRoomProperties | GuideMapCorridorProperties)[],
  userLocationId: number,
  currentFloor: number
): MapStairsFloorSwitcher {
  const previousPointBeforeUserInPathIndex =
    fullPathProperties.findIndex((stairs) => userLocationId === stairs.id) - 1;
  const previousFloorInPath =
    fullPathProperties[previousPointBeforeUserInPathIndex].floor;
  const isPreviousPointOnUpperFloor = previousFloorInPath > currentFloor;
  const arrowDirection = isPreviousPointOnUpperFloor
    ? MapStairsFloorSwitcher.ArrowUp
    : MapStairsFloorSwitcher.ArrowDown;

  return arrowDirection;
}

function getNextStairsArrowDirection(
  fullPathProperties: (GuideMapRoomProperties | GuideMapCorridorProperties)[],
  endPointId: number,
  currentFloor: number
): MapStairsFloorSwitcher {
  const nextPointBeforeUserInPathIndex =
    fullPathProperties.findIndex((stairs) => endPointId === stairs.id) + 1;
  const nextFloorInPath =
    fullPathProperties[nextPointBeforeUserInPathIndex].floor;
  const isNextPointOnUpperFloor = nextFloorInPath > currentFloor;
  const arrowDirection = isNextPointOnUpperFloor
    ? MapStairsFloorSwitcher.ArrowUp
    : MapStairsFloorSwitcher.ArrowDown;

  return arrowDirection;
}

export const MapDotUtils = {
  getNextStairsArrowDirection,
  getPrevStairsArrowDirection,
};
