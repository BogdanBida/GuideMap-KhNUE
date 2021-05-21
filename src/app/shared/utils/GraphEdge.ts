/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GraphVertex } from './GraphVertex';

export class GraphEdge {
  /**
   *
   *
   * @param startVertex
   * @param endVertex
   * @param [weight=1]
   */
  constructor(startVertex: GraphVertex, endVertex: GraphVertex, weight = 0) {
    this.startVertex = startVertex;
    this.endVertex = endVertex;
    this.weight = weight;
  }

  public startVertex: GraphVertex;

  public endVertex: GraphVertex;

  public weight: number;

  /**
   *
   *
   * @return
   */
  public getKey() {
    const startVertexKey = this.startVertex.getKey();
    const endVertexKey = this.endVertex.getKey();

    return `${startVertexKey}_${endVertexKey}`;
  }

  /**
   *
   *
   * @return
   */
  public reverse() {
    const tmp = this.startVertex;

    this.startVertex = this.endVertex;
    this.endVertex = tmp;

    return this;
  }

  /**
   *
   *
   * @return
   */
  public toString() {
    return this.getKey();
  }
}
