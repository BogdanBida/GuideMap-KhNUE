import { LocationNode, QRNode, RoomNode } from './index';

export interface JsonNodes {
  QRNodes: QRNode[];
  roomsNodes: RoomNode[];
  routeNodes: LocationNode[];
  paths: any[];
}
