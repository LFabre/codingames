const START = "0";
const EXIT = "E";

const graph = {};
const cache = {};

function graphAddNode(graph, id, money = 0) {
  if (graph[id]) {
    return;
  }

  graph[id] = {
    id,
    money,
    links: [],
  };
}

function graphAddLink(graph, n1, n2) {
  if (!graph[n1]) {
    return;
  }

  if (graph[n1].links.indexOf(n2) === -1) {
    graph[n1].links.push(n2);
  }
}

function topologicalSorting(graph, nodeId, visisted, stack) {
  visisted[nodeId] = true;

  for (const l of graph[nodeId].links) {
    if (!visisted[l]) {
      topologicalSorting(graph, l, visisted, stack);
    }
  }

  stack.push(nodeId);
}

function dagLongestPath(graph, start) {
  const distanceArray = {};
  const visited = {};
  const stack = [];

  for (let k of Object.keys(graph)) {
    distanceArray[k] = Number.NEGATIVE_INFINITY;
    visited[k] = false;
  }

  distanceArray[start] = graph[start].money;

  for (let k of Object.keys(graph)) {
    if (!visited[k]) topologicalSorting(graph, k, visited, stack);
  }

  while (stack.length) {
    let node = graph[stack.pop()];

    if (distanceArray[node.id] === Number.NEGATIVE_INFINITY) {
      continue;
    }

    for (const l of node.links) {
      if (distanceArray[l] < distanceArray[node.id] + graph[l].money) {
        distanceArray[l] = distanceArray[node.id] + graph[l].money;
      }
    }
  }

  return { distanceArray };
}

const N = parseInt(readline());
for (let i = 0; i < N; i++) {
  const [id, money, room1, room2] = readline().split(" ");

  graphAddNode(graph, id, Number(money));
  graphAddLink(graph, id, room1);
  graphAddLink(graph, id, room2);
}

graphAddNode(graph, EXIT);

const { distanceArray } = dagLongestPath(graph, START);

console.log(distanceArray[EXIT]);
