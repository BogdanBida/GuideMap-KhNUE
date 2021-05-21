import { LocationNode } from './location-node';

export interface RouteNode extends LocationNode {
  endRoom: number;
  corridors: number[];
}
