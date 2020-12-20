import { Dot, QRNode, RoomNode } from './index';

export interface JsonNodes {
  QRNodes: QRNode[];
  roomsNodes: RoomNode[];
  routeNodes: Dot[];
  paths: any[];
}
