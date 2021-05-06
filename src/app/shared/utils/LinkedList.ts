/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Comparator } from './Comparator';
import { GraphEdge } from './GraphEdge';
import { LinkedListNode } from './LinkedListNode';

export class LinkedList {
  /**
   *
   *
   * @param [comparatorFunction]
   */
  constructor(comparatorFunction: {
    (edgeA: GraphEdge, edgeB: GraphEdge): 0 | 1 | -1;
    (a: number, b: number): number;
  }) {
    this.head = null;
    this.tail = null;

    this.compare = new Comparator(comparatorFunction);
  }

  public head: LinkedListNode;

  public tail: LinkedListNode;

  public compare: Comparator;

  /**
   *
   *
   * @param value
   * @return
   */
  public prepend(value: number): LinkedList {
    // Make new node to be a head.
    const newNode = new LinkedListNode(value, this.head);

    this.head = newNode;

    // If there is no tail yet let's make new node a tail.
    if (!this.tail) {
      this.tail = newNode;
    }

    return this;
  }

  /**
   *
   *
   * @param value
   * @return
   */
  public append(value: number) {
    const newNode = new LinkedListNode(value);

    // If there is no head yet let's make new node a head.
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;

      return this;
    }

    // Attach new node to the end of linked list.
    this.tail.next = newNode;
    this.tail = newNode;

    return this;
  }

  /**
   *
   *
   * @param value
   * @return
   */
  public delete(value: GraphEdge) {
    if (!this.head) {
      return null;
    }

    let deletedNode = null;

    // If the head must be deleted then make 2nd node to be a head.
    while (this.head && this.compare.equal(this.head.value, value)) {
      deletedNode = this.head;
      this.head = this.head.next;
    }

    let currentNode = this.head;

    if (currentNode !== null) {
      // If next node must be deleted then make next node to be a next next one.
      while (currentNode.next) {
        if (this.compare.equal(currentNode.next.value, value)) {
          deletedNode = currentNode.next;
          currentNode.next = currentNode.next.next;
        } else {
          currentNode = currentNode.next;
        }
      }
    }

    // Check if tail must be deleted.
    if (this.compare.equal(this.tail.value, value)) {
      this.tail = currentNode;
    }

    return deletedNode;
  }

  /**
   *
   *
   * @param findParams
   * @param findParams.value
   * @param [findParams.callback]
   * @return
   */
  public find({ value = undefined, callback = undefined }) {
    if (!this.head) {
      return null;
    }

    let currentNode = this.head;

    while (currentNode) {
      // If callback is specified then try to find node by callback.
      if (callback && callback(currentNode.value)) {
        return currentNode;
      }

      // If value is specified then try to compare by value..
      if (value !== undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return null;
  }

  /**
   *
   *
   * @return
   */
  public deleteTail() {
    if (this.head === this.tail) {
      // There is only one node in linked list.
      const deletedTail = this.tail;

      this.head = null;
      this.tail = null;

      return deletedTail;
    }

    // If there are many nodes in linked list...
    const deletedTail = this.tail;

    // Rewind to the last node and delete "next" link for the node before the last one.
    let currentNode = this.head;

    while (currentNode.next) {
      if (!currentNode.next.next) {
        currentNode.next = null;
      } else {
        currentNode = currentNode.next;
      }
    }

    this.tail = currentNode;

    return deletedTail;
  }

  /**
   *
   *
   * @return
   */
  public deleteHead() {
    if (!this.head) {
      return null;
    }

    const deletedHead = this.head;

    if (this.head.next) {
      this.head = this.head.next;
    } else {
      this.head = null;
      this.tail = null;
    }

    return deletedHead;
  }

  /**
   *
   *
   * @return
   */
  public toArray() {
    const nodes = [];

    let currentNode = this.head;

    while (currentNode) {
      nodes.push(currentNode);
      currentNode = currentNode.next;
    }

    return nodes;
  }

  /**
   *
   *
   * @param [callback]
   * @return
   */
  public toString(callback: (arg0: number) => any) {
    return this.toArray()
      .map((node) => node.toString(callback))
      .toString();
  }
}
