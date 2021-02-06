import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NodeType } from '../enums/node-type.enum';
import { QRNode, RoomNode } from '../models';
import { LocationNode } from '../models/location-node';
import { Path } from '../models/path';
import { environment } from './../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private http: HttpClient) { }

  public getRoomsNodes(): Observable<RoomNode[]> {
    return this.getJsonDoc('mc', 1, NodeType.RoomNode);
  }

  public getQRNodes(): Observable<QRNode[]> {
    return this.getJsonDoc('mc', 1, NodeType.QrNode);
  }

  public getRouteNodes(): Observable<LocationNode[]> {
    return this.getJsonDoc('mc', 1, NodeType.RouteNode);
  }

  public getPaths(): Observable<Path[]> {
    return this.getJsonDoc('mc', 1, NodeType.PathNode);
  }

  private getJsonDoc(corpsName: string, floor: number, type: string): Observable<any> {
    return this.http.get<Path[]>(`${environment.url}assets/json_data/${corpsName}${floor}/${type}.json`);
  }
}
