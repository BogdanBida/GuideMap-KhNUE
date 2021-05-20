/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable */
import { GraphEdge } from './GraphEdge';
import { LinkedList } from './LinkedList';

export class GraphVertex {
  constructor(value: string) {
    if (value === undefined) {
      throw new Error('Graph vertex must have a value');
    }

    const edgeComparator = (edgeA: GraphEdge, edgeB: GraphEdge) => {
      if (edgeA.getKey() === edgeB.getKey()) {
        return 0;
      }

      return edgeA.getKey() < edgeB.getKey() ? -1 : 1;
    };

    // Normally you would store string value like vertex name.
    // But generally it may be any object as well
    this.value = value;
    this.edges = new LinkedList(edgeComparator as any);
  }

  public value: any;

  public edges: LinkedList;

  public addEdge(edge: GraphEdge): GraphVertex {
    this.edges.append(edge as any);

    return this;
  }

  public deleteEdge(edge: GraphEdge) {
    this.edges.delete(edge);
  }

  public getNeighbors(): GraphVertex[] {
    const edges = this.edges.toArray();

    const neighborsConverter = (node: any) => {
      return node.value.startVertex === this
        ? node.value.endVertex
        : node.value.startVertex;
    };

    // Return either start or end vertex.
    // For undirected graphs it is possible that current vertex will be the end one.
    return edges.map(neighborsConverter);
  }

  public getEdges(): any[] {
    return this.edges.toArray().map((linkedListNode) => linkedListNode.value);
  }

  public getDegree(): number {
    return this.edges.toArray().length;
  }

  public hasEdge(requiredEdge: GraphEdge): boolean {
    const edgeNode = this.edges.find({
      callback: (edge: GraphEdge) => edge === requiredEdge,
    });

    return !!edgeNode;
  }

  public hasNeighbor(vertex: GraphVertex): boolean {
    const vertexNode = this.edges.find({
      callback: (edge: GraphEdge) =>
        edge.startVertex === vertex || edge.endVertex === vertex,
    });

    return !!vertexNode;
  }

  public findEdge(vertex: GraphVertex): GraphEdge | null | number {
    const edgeFinder = (_edge: GraphEdge) => {
      return _edge.startVertex === vertex || _edge.endVertex === vertex;
    };

    const edge = this.edges.find({ callback: edgeFinder });

    return edge ? edge.value : null;
  }

  public getKey(): any {
    return this.value;
  }

  public deleteAllEdges(): GraphVertex {
    this.getEdges().forEach((edge) => this.deleteEdge(edge));

    return this;
  }

  public toString(callback: Function): string {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
