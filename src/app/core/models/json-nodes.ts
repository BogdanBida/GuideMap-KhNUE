import { QRNode, RoomNode } from './index';
import { LocationNode } from './location-node';

export interface JsonNodes {
  QRNodes: QRNode[];
  roomsNodes: RoomNode[];
  routeNodes: LocationNode[];
  paths: any[];
}
