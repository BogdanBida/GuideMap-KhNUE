import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Dot, JsonNodes, QRNode, RoomNode } from './../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class NodeService {
  constructor(private http: HttpClient) {}

  public getRoomsNodes(): Observable<RoomNode[]> {
    return this.getData().pipe(map((value) => value.roomsNodes));
  }

  public getQRNodes(): Observable<QRNode[]> {
    return this.getData().pipe(map((value) => value.QRNodes));
  }

  public getRouteNodes(): Observable<Dot[]> {
    return this.getData().pipe(map((value) => value.routeNodes));
  }

  private getData(): Observable<JsonNodes> {
    return this.http.get<JsonNodes>(
      `http://localhost:4200/assets/json_data/mc_1.json`
    );
  }
}
