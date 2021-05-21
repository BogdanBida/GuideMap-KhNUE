/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/naming-convention */
import { LocationNode, QRNode, RoomNode } from './index';

export interface JsonNodes {
  QRNodes: QRNode[];
  roomsNodes: RoomNode[];
  routeNodes: LocationNode[];
  paths: any[];
}
