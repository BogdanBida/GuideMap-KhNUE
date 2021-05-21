import { LocationNode } from './location-node';
import { RouteNode } from './route-node';

export interface RoomNode extends LocationNode {
  name: string;
  routes: RouteNode[];
}
