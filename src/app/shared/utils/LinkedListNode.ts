/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export class LinkedListNode {
  constructor(value: number, next: null | LinkedListNode = null) {
    this.value = value;
    this.next = next;
  }

  public value: number;

  public next: LinkedListNode;

  public toString(callback: (arg0: number) => any) {
    return callback ? callback(this.value) : `${this.value}`;
  }
}
