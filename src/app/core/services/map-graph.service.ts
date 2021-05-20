import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
  distance,
  floydWarshall,
  Graph,
  GraphEdge,
  GraphVertex
} from 'src/app/shared/utils';
import {
  GuideMapCorridorProperties,
  GuideMapRoomProperties,
  GuideMapSimpleRoute
} from '../models';
import { MapUtils } from '../utils';
import { MapDataProviderService } from './map-data-provider.service';

@Injectable({
  providedIn: 'root',
})
export class MapGraphService {
  constructor(
    private readonly _mapDataProviderService: MapDataProviderService
  ) {}

  public readonly dataLoaded$ = new BehaviorSubject<boolean>(false);

  private readonly _graph = new Graph();

  private _nextVertices: GraphVertex[][] = [];

  public get nextVertices(): GraphVertex[][] {
    return this._nextVertices;
  }

  public createGraph(): void {
    const { roomsVertexes, corridorsVertexes, qrCodesVertexes } =
      this._getAllVertexes();
    const corridorsEdges = this._getCorridorsEdges(corridorsVertexes);
    const allRoomsVertexes = [...qrCodesVertexes, ...roomsVertexes];
    const roomToCorridorEdges = this._getRoomToCorridorEdges(
      allRoomsVertexes,
      corridorsVertexes
    );
    const allEdges = [...corridorsEdges, ...roomToCorridorEdges];
    const allVertexes = [...allRoomsVertexes, ...corridorsVertexes];

    this._initGraph(allVertexes, allEdges);
    this._calculateGraphDistances();
    this.dataLoaded$.next(true);
  }

  public findPath(
    from: string,
    to: string,
    resultList: any[] = [],
    dataSet: any[] = []
  ): GuideMapSimpleRoute[] {
    // TODO: refactor add new methods

    if (from === undefined || to === undefined) {
      return [];
    }

    const startVertex = this._graph.getVertexByKey(from);
    const endVertex = this._graph.getVertexByKey(to);
    const allGraphVertices = this._graph.getAllVertices();

    const startVertexIndex = allGraphVertices.indexOf(startVertex);
    const endVertexIndex = allGraphVertices.indexOf(endVertex);

    const nextVertex = this.nextVertices[endVertexIndex][startVertexIndex];

    if (!nextVertex) {
      return [];
    }

    const midNodeId = nextVertex.getKey();

    if (midNodeId === to) {
      resultList.push({
        start: from,
        end: midNodeId,
      });

      return resultList;
    }

    const foundedPathFromToMid = this.findPath(from, midNodeId, resultList);

    return this.findPath(midNodeId, to, foundedPathFromToMid, dataSet);
  }

  private _getAllVertexes(): {
    roomsVertexes: GraphVertex[];
    qrCodesVertexes: GraphVertex[];
    corridorsVertexes: GraphVertex[];
  } {
    return {
      roomsVertexes: MapUtils.getVertexes(this._mapDataProviderService.rooms),
      qrCodesVertexes: MapUtils.getVertexes(
        this._mapDataProviderService.qrCodes
      ),
      corridorsVertexes: MapUtils.getVertexes(
        this._mapDataProviderService.corridors
      ),
    };
  }

  private _initGraph(vertexes: GraphVertex[], edges: GraphEdge[]): void {
    vertexes.forEach((vertex: GraphVertex) => {
      this._graph.addVertex(vertex);
    });

    edges.forEach((edge: GraphEdge) => {
      this._graph.addEdge(edge);
    });
  }

  private _getRoomToCorridorEdges(
    roomVertexes: GraphVertex[],
    corridorsVertexes: GraphVertex[]
  ): GraphEdge[] {
    // TODO: refactor add new methods

    const corridorsEdges: GraphEdge[] = [];
    const qrCodesAndRooms = this._mapDataProviderService.qrCodesAndRooms; // !!!
    const corridors = this._mapDataProviderService.corridors; // !!!

    roomVertexes.forEach((roomVertex) => {
      const foundedRoomItem = qrCodesAndRooms.find(
        ({ properties }) => roomVertex.getKey() === properties.id
      )?.properties;

      if (foundedRoomItem) {
        const foundedCorridorVertex = corridorsVertexes.find(
          (corridorsVertex) =>
            corridorsVertex.getKey() ===
            (foundedRoomItem as GuideMapRoomProperties).corridor
        );

        if (foundedCorridorVertex) {
          const foundedCorridorItem = corridors.find(
            (corridor) =>
              corridor.properties.id === foundedCorridorVertex.getKey()
          ).properties;

          const edge = new GraphEdge(
            foundedCorridorVertex,
            roomVertex,
            distance(
              foundedRoomItem.x,
              foundedRoomItem.y,
              foundedCorridorItem.x,
              foundedCorridorItem.y
            )
          );

          corridorsEdges.push(edge);
        }
      }
    });

    return corridorsEdges;
  }

  private _getCorridorsEdges(corridorsVertexes: GraphVertex[]): GraphEdge[] {
    // TODO: refactor add new methods
    const corridors = this._mapDataProviderService.corridors$.getValue();
    const oneToManyCorridorsEdges: GraphEdge[] = [];

    corridorsVertexes.forEach((corridor) => {
      const foundedCorridorItem = corridors.find(
        ({ properties }) => corridor.getKey() === properties.id
      )?.properties;

      (foundedCorridorItem as GuideMapCorridorProperties).corridors.forEach(
        (corridorId: number) => {
          const foundedRelatedCorridorVertex = corridorsVertexes.find(
            (corridorItem) => corridorItem.getKey() === corridorId
          );

          if (foundedRelatedCorridorVertex) {
            const foundedRelatedCorridorItem = corridors.find(
              ({ properties }) =>
                properties.id === foundedRelatedCorridorVertex.getKey()
            ).properties;

            const oneToOneCorridorEdge = new GraphEdge(
              corridor,
              foundedRelatedCorridorVertex,
              distance(
                foundedCorridorItem.x,
                foundedCorridorItem.y,
                foundedRelatedCorridorItem.x,
                foundedRelatedCorridorItem.y
              )
            );

            oneToManyCorridorsEdges.push(oneToOneCorridorEdge);
          }
        }
      );
    });

    return oneToManyCorridorsEdges;
  }

  private _calculateGraphDistances(): void {
    const { nextVertices } = floydWarshall(this._graph);

    this._nextVertices = nextVertices;
  }
}
