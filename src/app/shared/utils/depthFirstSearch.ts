import { Graph, GraphVertex } from ".";

type CallBacks = Partial<{
  enterVertex: (vertices: Object) => any;
  leaveVertex: (vertices: Object) => any;
  allowTraversal: (vertices: any) => any;
}>

function initCallbacks(callbacks: CallBacks = {}) {
  const initiatedCallback = callbacks;

  const stubCallback = () => {};

  const allowTraversalCallback = (
    () => {
      const seen = {};
      return ({ nextVertex }) => {
        if (!seen[nextVertex.getKey()]) {
          seen[nextVertex.getKey()] = true;
          return true;
        }
        return false;
      };
    }
  )();

  initiatedCallback.allowTraversal = callbacks.allowTraversal || allowTraversalCallback;
  initiatedCallback.enterVertex = callbacks.enterVertex || stubCallback;
  initiatedCallback.leaveVertex = callbacks.leaveVertex || stubCallback;

  return initiatedCallback;
}

function depthFirstSearchRecursive(graph: Graph, currentVertex: GraphVertex, previousVertex: GraphVertex, callbacks: CallBacks) {
  callbacks.enterVertex({ currentVertex, previousVertex });

  graph.getNeighbors(currentVertex).forEach((nextVertex) => {
    if (callbacks.allowTraversal({ previousVertex, currentVertex, nextVertex })) {
      depthFirstSearchRecursive(graph, nextVertex, currentVertex, callbacks);
    }
  });

  callbacks.leaveVertex({ currentVertex, previousVertex });
}

export function depthFirstSearch(graph: Graph, startVertex: GraphVertex, callbacks: CallBacks) {
  const previousVertex = null;
  depthFirstSearchRecursive(graph, startVertex, previousVertex, initCallbacks(callbacks));
}
